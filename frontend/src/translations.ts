export type Language = 'English' | 'Hindi' | 'Telugu';

export interface TranslationSchema {
    sidebar: {
        dashboard: string;
        solver: string;
        concepts: string;
        practice: string;
        pyqbank: string;
        analytics: string;
        achievements: string;
        settings: string;
        logout: string;
    };
    header: {
        welcome: string;
        profile: string;
    };
    solver: {
        title: string;
        placeholder: string;
        subject: string;
        solve_btn: string;
        examples: string;
        explanation_level: string;
    };
    concepts: {
        title: string;
        search: string;
        topics: string;
        sim_title: string;
        sim_btn: string;
        video_ref: string;
        remove: string;
    };
    pyq: {
        title: string;
        search: string;
        empty: string;
    };
    dashboard: {
        welcome: string;
        subtitle: string;
        solve_btn: string;
        stats: {
            solved: string;
            streak: string;
            accuracy: string;
            mastered: string;
        };
        quick_actions: string;
        recent_activity: string;
    };
}

export const translations: Record<Language, TranslationSchema> = {
    English: {
        sidebar: {
            dashboard: 'Dashboard',
            solver: 'Problem Solver',
            concepts: 'Concepts',
            practice: 'Practice',
            pyqbank: 'PYQ Bank',
            analytics: 'Analytics',
            achievements: 'Achievements',
            settings: 'Settings',
            logout: 'Logout',
        },
        header: {
            welcome: 'Welcome back',
            profile: 'Profile',
        },
        solver: {
            title: 'Problem Solver',
            placeholder: 'Type your STEM problem here (e.g., Calculate acceleration...)',
            subject: 'Subject',
            solve_btn: 'Solve with AI',
            examples: 'Try Examples',
            explanation_level: 'Explanation Level',
        },
        concepts: {
            title: 'Concepts library',
            search: 'Search topics...',
            topics: 'Topics',
            sim_title: 'Interactive 2D Simulation',
            sim_btn: 'Interactive Simulation',
            video_ref: 'Video Reference',
            remove: 'Remove',
        },
        pyq: {
            title: 'PYQ Bank',
            search: 'Search questions or exams...',
            empty: 'No PYQs yet',
        },
        dashboard: {
            welcome: 'Welcome to STEM Engine',
            subtitle: 'Your AI-powered adaptive learning companion for Physics, Chemistry, Biology and Mathematics.',
            solve_btn: 'Solve a Problem',
            stats: {
                solved: 'Problems Solved',
                streak: 'Day Streak',
                accuracy: 'Accuracy',
                mastered: 'Topics Mastered',
            },
            quick_actions: 'Quick Actions',
            recent_activity: 'Recent Activity',
        },
    },
    Hindi: {
        sidebar: {
            dashboard: 'डैशबोर्ड',
            solver: 'समस्या समाधान',
            concepts: 'कॉन्सेप्ट्स',
            practice: 'अभ्यास',
            pyqbank: 'PYQ बैंक',
            analytics: 'एनालिटिक्स',
            achievements: 'उपलब्धियां',
            settings: 'सेटिंग्स',
            logout: 'लॉगआउट',
        },
        header: {
            welcome: 'वापसी पर स्वागत है',
            profile: 'प्रोफ़ाइल',
        },
        solver: {
            title: 'समस्या समाधान',
            placeholder: 'अपनी समस्या यहाँ लिखें (जैसे, त्वरण की गणना करें...)',
            subject: 'विषय',
            solve_btn: 'AI के साथ हल करें',
            examples: 'उदाहरण प्रयास करें',
            explanation_level: 'व्याख्या का स्तर',
        },
        concepts: {
            title: 'कॉन्सेप्ट लाइब्रेरी',
            search: 'विषय खोजें...',
            topics: 'विषय',
            sim_title: 'इंटरैक्टिव 2D सिमुलेशन',
            sim_btn: 'इंटरैक्टिव सिमुलेशन',
            video_ref: 'वीडियो संदर्भ',
            remove: 'निकालें',
        },
        pyq: {
            title: 'PYQ बैंक',
            search: 'प्रश्न या परीक्षा खोजें...',
            empty: 'अभी तक कोई PYQ नहीं',
        },
        dashboard: {
            welcome: 'STEM इंजन में आपका स्वागत है',
            subtitle: 'भौतिकी, रसायन विज्ञान, जीव विज्ञान और गणित के लिए आपका AI-संचालित शिक्षण साथी।',
            solve_btn: 'एक समस्या हल करें',
            stats: {
                solved: 'हल की गई समस्याएं',
                streak: 'डे स्ट्रीक',
                accuracy: 'सटीकता',
                mastered: 'महारत वाले विषय',
            },
            quick_actions: 'त्वरित कार्रवाई',
            recent_activity: 'हाल की गतिविधि',
        },
    },
    Telugu: {
        sidebar: {
            dashboard: 'డ్యాష్‌బోర్డ్',
            solver: 'సమస్య పరిష్కరిణి',
            concepts: 'భావనలు',
            practice: 'సాధన',
            pyqbank: 'PYQ బ్యాంక్',
            analytics: 'విశ్లేషణలు',
            achievements: 'విజయాలు',
            settings: 'సెట్టింగ్‌లు',
            logout: 'లాగ్ అవుట్',
        },
        header: {
            welcome: 'తిరిగి స్వాగతం',
            profile: 'ప్రొఫైల్',
        },
        solver: {
            title: 'సమస్య పరిష్కరిణి',
            placeholder: 'మీ సమస్యను ఇక్కడ టైప్ చేయండి (ఉదా. త్వరణాన్ని లెక్కించండి...)',
            subject: 'విషయం',
            solve_btn: 'AI తో పరిష్కరించండి',
            examples: 'ఉదాహరణలను ప్రయత్నించండి',
            explanation_level: 'వివరణ స్థాయి',
        },
        concepts: {
            title: 'కాన్సెప్ట్ లైబ్రరీ',
            search: 'అంశాలను శోధించండి...',
            topics: 'అంశాలు',
            sim_title: 'ఇంటరాక్టివ్ 2D సిమ్యులేషన్',
            sim_btn: 'ఇంటరాక్టివ్ సిమ్యులేషన్',
            video_ref: 'వీడియో రిఫరెన్స్',
            remove: 'తొలగించు',
        },
        pyq: {
            title: 'PYQ బ్యాంక్',
            search: 'ప్రశ్నలు లేదా పరీక్షలను శోధించండి...',
            empty: 'ఇంకా PYQలు లేవు',
        },
        dashboard: {
            welcome: 'STEM ఇంజిన్ కు స్వాగతం',
            subtitle: 'ఫిజిక్స్, కెమిస్ట్రీ, బయాలజీ మరియు మ్యాథమెటిక్స్ కోసం మీ AI-ఆధారిత లెర్నింగ్ కంపానియన్.',
            solve_btn: 'సమస్యను పరిష్కరించండి',
            stats: {
                solved: 'పరిష్కరించబడిన సమస్యలు',
                streak: 'డే స్ట్రీక్',
                accuracy: 'ఖచ్చితత్వం',
                mastered: 'మాస్టర్ చేసిన అంశాలు',
            },
            quick_actions: 'త్వరిత చర్యలు',
            recent_activity: 'ఇటీవలి కార్యాచరణ',
        },
    },
};
