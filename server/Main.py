import NBAStats
import DKDraftablesAPI 
import DKDraftGroupsAPI
import pandas as pd

draftGroupsDf =  DKDraftGroupsAPI.SportContests().getSportGroupIds('NBA')
print(draftGroupsDf)

nbaStatsDf = NBAStats.NBAStatsClass().getNBAstats('2022-23', 'PerGame', 'Regular%20Season')
draftablesDf = DKDraftablesAPI.DKDraftables().getDKDraftables(85804)

finalDf = pd.merge(nbaStatsDf, draftablesDf)
finalDf.loc[finalDf['status'] == 'OUT', 'jackDKavgFPTs'] = 0


finalDf2 = pd.merge(finalDf, draftGroupsDf)




finalDf2['PPM'] = round(finalDf2['jackDKavgFPTs'] / finalDf2['MIN'], 2)

finalDf2.loc[finalDf2['Type'] == 'Classic'] = finalDf2.drop_duplicates(subset='displayName')
#finalDf2.loc[finalDf2['Type'] != 'Showdown Captain Mode', 'pos'] = 'None'
finalDf2.loc[(finalDf2['Type'] == 'Showdown Captain Mode') & (finalDf2['rosterSlotId'] == 476), 'pos'] = 'CPT'
finalDf2.loc[(finalDf2['Type'] == 'Showdown Captain Mode') & (finalDf2['rosterSlotId'] == 475), 'pos'] = 'UTIL'

finalDf2 = finalDf2.dropna()
editable = finalDf2[['displayName', 'teamAbbreviation', 'jackDKavgFPTs', 'PPM']]
editable = editable.drop_duplicates(subset='displayName')
editable = editable.assign(newMins=None, newAvgPoints =None)

word = str(finalDf2['Team'][1]).replace(" ","")

finalDf2.to_csv('final.csv', index=False)
editable.to_csv(f'{word}editThis.csv', index=False)

newEditedData = pd.read_csv(f'{word}editWasMade.csv')

idk = pd.merge(finalDf2, newEditedData)

idk.loc[(idk['Type'] == 'Showdown Captain Mode') & (idk['rosterSlotId'] == 476), 'newAvgPoints'] = idk['newAvgPoints'] * 1.5



idk.to_csv(f'{word}_Final.csv', index=False)




