import pulp
import pandas as pd
    
data_file = 'LALvsDEN_Final.csv'

df = pd.read_csv(data_file, index_col=['displayName', 'pos'], skipinitialspace=True)

totalMoney = 0
totalPoints = 0

legal_assignments = df.index   
name_set = df.index.unique(0)  

costs = df['salary'].to_dict()
values = df['newAvgPoints'].to_dict()
team = df['teamAbbreviation'].to_dict()
pos = df['position'].to_dict()
mins = df['newMins'].to_dict()

# set up LP
draft = pulp.LpVariable.dicts('selected', legal_assignments, cat='Binary')

prob = pulp.LpProblem('Draft_Kings_Showdown', pulp.LpMaximize)

# obj
prob += pulp.lpSum([draft[n, p]*values[n,p] for (n, p) in legal_assignments])

# salary cap
prob += pulp.lpSum([draft[n, p]*costs[n,p] for (n, p) in legal_assignments]) <= 50000

# pick 5 UTIL
prob += pulp.lpSum([draft[n, p] for (n, p) in legal_assignments if p == 'UTIL']) == 5

# pick 1 CPT
prob += pulp.lpSum([draft[n, p] for (n, p) in legal_assignments if p == 'CPT']) == 1

# use each player only once
for name in name_set:
    prob += pulp.lpSum([draft[n, p] for (n, p) in legal_assignments if n == name]) <=1
    

addNames = []


for names in addNames:
    prob += pulp.lpSum([draft[n, p] for (n, p) in legal_assignments if n == names]) == 1

removeNames = []


for names in removeNames:
    prob += pulp.lpSum([draft[n, p] for (n, p) in legal_assignments if n == names]) == 0



prob += pulp.lpSum([draft[n, p]*values[n,p] for (n, p) in legal_assignments]) <= 500
prob.solve()

lineup = []

for idx in draft:
    if draft[idx].varValue:
        lineup.append({
                        'Name': idx[0],
                        'Salary': costs[idx],
                        'Role': idx[1],
                        'PPG': values[idx],
                        'Minutes': mins[idx],
                        'Position': pos[idx],
                        'Team': team[idx]
                })
        
lineups = pd.DataFrame(lineup)
lineups = lineups.sort_values(by=['Role', 'PPG'], ascending=[True, False])
totalMoney = lineups['Salary'].sum()
totalPoints = lineups['PPG'].sum()
print(lineups)
        
print("Total used amount of salary cap:", totalMoney, "Amount remaining: ", 50000 - totalMoney)
print("Projected points for the game: ", round(totalPoints, 2))
