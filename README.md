TooltipText =
VAR selectedRegion = SELECTEDVALUE('SummarizedData'[Region])
VAR regionName = SELECTEDVALUE('SummarizedData'[RegionName])
VAR grants = 
    CALCULATE(
        SUM('SummarizedData'[TotalGrants]),
        ALLEXCEPT('SummarizedData', 'SummarizedData'[Region])
    )

RETURN
IF(
    ISBLANK(selectedRegion),
    BLANK(),
    "Region:     " & selectedRegion & UNICHAR(10) &
    "            " & regionName & UNICHAR(10) & UNICHAR(10) &
    "Total Grants:  " & FORMAT(grants, "#,##0")
)
