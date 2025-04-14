TooltipText =
VAR selectedCountry = SELECTEDVALUE('SummarizedTable'[Country])
VAR selectedRegion = LOOKUPVALUE('SummarizedData'[Region], 'SummarizedData'[Country], selectedCountry)
VAR regionName = LOOKUPVALUE('SummarizedData'[RegionName], 'SummarizedData'[Country], selectedCountry)
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
