TooltipText =
VAR selectedRegion = SELECTEDVALUE('SummarizedTable'[Region])
VAR regionName = LOOKUPVALUE('SummarizedData'[RegionName], 'SummarizedData'[Region], selectedRegion)
VAR grants = 
    CALCULATE(
        SUM('SummarizedData'[TotalGrants]),
        FILTER('SummarizedData', 'SummarizedData'[Region] = selectedRegion)
    )

RETURN
IF(
    ISBLANK(selectedRegion),
    BLANK(),
    "Region:     " & selectedRegion & UNICHAR(10) &
    "            " & regionName & UNICHAR(10) & UNICHAR(10) &
    "Total Grants:  " & FORMAT(grants, "#,##0")
)
