-- =====================================================
-- STEM Engine: Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- =====================================================

-- 1. Profiles (one per auth user)
CREATE TABLE IF NOT EXISTS profiles (
    id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL,
    role          TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
    problems_solved INT DEFAULT 0,
    xp            INT DEFAULT 0,
    streak        INT DEFAULT 0,
    last_active   TIMESTAMPTZ,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Teachers can view student profiles" ON profiles FOR SELECT USING (true);

-- 2. Communities (created by teachers)
CREATE TABLE IF NOT EXISTS communities (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    passcode    TEXT NOT NULL UNIQUE,
    teacher_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage their community" ON communities FOR ALL USING (auth.uid() = teacher_id);
CREATE POLICY "Anyone can read communities by passcode" ON communities FOR SELECT USING (true);

-- 3. Community members
CREATE TABLE IF NOT EXISTS community_members (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id  UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role          TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
    joined_at     TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(community_id, user_id)
);
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members and teachers can read" ON community_members FOR SELECT USING (true);
CREATE POLICY "Anyone can join" ON community_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Teachers can remove members" ON community_members FOR DELETE USING (true);

-- 4. Universal PYQ Bank
CREATE TABLE IF NOT EXISTS universal_pyqs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question    TEXT NOT NULL,
    exam        TEXT,
    year        TEXT,
    subject     TEXT,
    saved_at    TEXT,
    added_by    TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE universal_pyqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read PYQs" ON universal_pyqs FOR SELECT USING (true);
CREATE POLICY "Authenticated can add PYQs" ON universal_pyqs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can delete" ON universal_pyqs FOR DELETE USING (auth.uid() IS NOT NULL);

-- 5. YouTube Videos
CREATE TABLE IF NOT EXISTS youtube_videos (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title         TEXT NOT NULL,
    url           TEXT NOT NULL,
    subject       TEXT NOT NULL DEFAULT 'General',
    description   TEXT,
    community_id  UUID REFERENCES communities(id) ON DELETE SET NULL,
    added_by      UUID REFERENCES profiles(id),
    created_at    TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read videos" ON youtube_videos FOR SELECT USING (true);
CREATE POLICY "Teachers can add videos" ON youtube_videos FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Teachers can delete videos" ON youtube_videos FOR DELETE USING (auth.uid() IS NOT NULL);

-- =====================================================
-- Realtime: enable realtime for these tables
-- (run in Supabase Dashboard → Table Editor → Replication)
-- =====================================================
-- ALTER PUBLICATION supabase_realtime ADD TABLE universal_pyqs;
-- ALTER PUBLICATION supabase_realtime ADD TABLE youtube_videos;
-- ALTER PUBLICATION supabase_realtime ADD TABLE community_members;
