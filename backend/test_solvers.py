import sys
sys.path.insert(0, r'c:\Users\venup\OneDrive\Desktop\MPC cal\backend')

from engine.word_problem_solver import solve_word_problem
import json

try:
    print('--- Testing Circuit Solver ---')
    res_circuit = solve_word_problem('circuit series voltage 24V R1 6ohm R2 12ohm', 'Step by Step')
    print(json.dumps(res_circuit, indent=2))
    
    print('\n--- Testing Organic Chem Solver ---')
    res_organic = solve_word_problem('organic chemistry: CH3 CH2 OH name', 'Step by Step')
    print(json.dumps(res_organic, indent=2))
    
except Exception as e:
    print('Error:', e)
