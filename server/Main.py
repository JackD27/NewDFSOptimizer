import NBAStats
import DKDraftablesAPI 
import DKDraftGroupsAPI
import pandas as pd

draftablesClass = DKDraftablesAPI.DKDraftables()
nbaStatsClass = NBAStats.NBAStatsClass()
draftGroupsClass = DKDraftGroupsAPI.SportContests()

draftGroupsDf = draftGroupsClass.getSportGroupIds('NBA')
print(draftGroupsDf)

nbaStatsDf = nbaStatsClass.getNBAstats('2022-23', 'PerGame', 'Regular%20Season')
draftablesDf = draftablesClass.getDKDraftables(85804)

# nbaStatsDf.to_csv('holy2.csv', index=False)
# draftablesDf.to_csv('holy.csv', index=False)

finalDf = pd.merge(nbaStatsDf, draftablesDf)
finalDf.loc[finalDf['status'] == 'OUT', 'jackDKavgFPTs'] = 0
finalDf['PPM'] = round(finalDf['jackDKavgFPTs'] / finalDf['MIN'], 2)

finalDf.to_csv('final.csv', index=False)



