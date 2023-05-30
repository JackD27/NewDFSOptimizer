import NBAStats
import DKDraftablesAPI 
import DKDraftGroupsAPI
import pandas as pd
import color

draftGroupsDf =  DKDraftGroupsAPI.SportContests().getSportGroupIds('NBA')
print(draftGroupsDf)
lol = 'Regular%20Season'
lol1 = 'Playoffs'
nbaStatsDf = NBAStats.NBAStatsClass().getNBAstats('2022-23', 'PerGame', lol1)
draftablesDf = DKDraftablesAPI.DKDraftables().getDKDraftables(87922)

finalDf = pd.merge(nbaStatsDf, draftablesDf)
finalDf.loc[finalDf['status'] == 'OUT', 'jackDKavgFPTs'] = 0


finalDf2 = pd.merge(finalDf, draftGroupsDf)




finalDf2['PPM'] = round(finalDf2['jackDKavgFPTs'] / finalDf2['MIN'], 2)

finalDf2.loc[finalDf2['Type'] == 'Classic'] = finalDf2.drop_duplicates(subset='displayName')
finalDf2 = finalDf2.join(finalDf2['position'].str.split('/', expand=True).stack().reset_index(level=1, drop=True).rename('pos')).reset_index(drop=True)
finalDf2.loc[(finalDf2['Type'] == 'Showdown Captain Mode') & (finalDf2['rosterSlotId'] == 476), 'pos'] = 'CPT'
finalDf2.loc[(finalDf2['Type'] == 'Showdown Captain Mode') & (finalDf2['rosterSlotId'] == 475), 'pos'] = 'UTIL'

finalDf2 = finalDf2.dropna()
editable = finalDf2[['displayName', 'teamAbbreviation', 'jackDKavgFPTs', 'PPM']]
editable = editable.drop_duplicates(subset='displayName')
editable = editable.assign(newMins=None, newAvgPoints=None, sportsLineMins=None, sportsLineAvgPoints=None)


try:
    word = str(finalDf2['Team'][1]).replace(" ","")
    editable.to_csv(word+'editThis.csv', index=False)
except:
    editable.to_csv('ClassicEditThis.csv', index=False)

finalDf2.to_csv('final.csv', index=False)


try:
    newEditedData = pd.read_csv(f'{word}editWasMade.csv')


    idk = pd.merge(finalDf2, newEditedData)

    idk.loc[(idk['Type'] == 'Showdown Captain Mode') & (idk['rosterSlotId'] == 476), 'newAvgPoints'] = idk['newAvgPoints'] * 1.5
    idk.loc[(idk['Type'] == 'Showdown Captain Mode') & (idk['rosterSlotId'] == 476), 'sportsLineAvgPoints'] = idk['sportsLineAvgPoints'] * 1.5

    idk= idk.drop_duplicates()



    idk.to_csv(f'{word}_Final.csv', index=False)
except:
    print(f"{color.bcolors.FAIL}CSV file doesn't exist. Most likely {word}editWasMade.csv file hasn't been created.{color.bcolors.ENDC}")




