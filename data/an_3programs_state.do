
* 0.1: PREFERENCES
clear all
set more off
set varabbrev on

* 0.2: DIRECTORIES
global base_dir_ari 		"/Users/ariadna/Box Sync/public charge blog/data" 
global base_dir_aridesk 	"/Users/ariadnavargas/Box Sync/public charge blog/data" 

cd "${base_dir_ari}"

* 0.3: FILE NAMES

* INPUTS
global read				"clean/3programs_state.dta"

* OUTPUTS
global save						"stats/public_benefits_tables.xlsx"
global save_snap				"stats/public_benefits_tables_snap.xlsx"
global save_reg					"stats/public_benefits_reg.txt"

/* *********************************************************************
	PART 1: DESCRIPTIVES
********************************************************************* */


/* NUMBER OF TABLES */
local tables 3 //  <-- specify number of tables

/* TABLE 1 */

local varlist_1 wic_biannual_chan_0717 wic_biannual_chan_0118 ///
wic_biannual_chan_0718  wic_biannual_chan_0119  // <-- specify variables to be included in table 1
// local note_1 "Fuente: datos admin de kubo"
local title_1 "WIC - Average biannual change in enrollment per state (%)"
//
// /* TABLE 2 */
//
local varlist_2  med_biannual_chan_0118 med_biannual_chan_0718 med_biannual_chan_0119
// local note_2 "Fuente: datos admin de kubo"
local title_2 "Medicaid - Average biannual change in enrollment per state (%)"
//
/* TABLE 3 */
local varlist_3  snap_change_0117 snap_change_0717 snap_change_0118 ///
snap_change_0718 snap_change_0119

local title_3 "SNAP - Average biannual change in enrollment per state (%)"


/*----------------------------------------------------------------------------------------------*/

use "${read}"

local line=1

forval x= 1/`tables' {
	/* Add title */
	putexcel set "${save}" , sheet(Sheet1) modify // <-- specify file and sheet names
	putexcel A`line' = ("`title_`x''"), bold font(Arial, 12)  
	local ++line
	putexcel A`line':E`line',  border(bottom) bold overwritefmt 
	local ++line 
	/* Statistics */
	tabstat `varlist_`x'', statistics(mean min max N) columns(statistics) save 
	mat stats = r(StatTotal)' 
	putexcel A`line'=matrix(stats) , /// <-- specify cell in sheet to write output
	nformat(#,0.0) names  font(Arial, 10) // number format
	/* Replace column names */
	putexcel A`line' = ("Variable") B`line' = ("Mean") C`line' = ("Min") D`line' = ("Max")  , font(Arial, 10) // <-- names of columns and cells
	/* Replace variable names with their labels */
	putexcel A`line':E`line', hcenter border(bottom) bold overwritefmt
	foreach var of varlist `varlist_`x'' { // <-- specify variables
		local varlabel : var label `var'
		local ++line
		putexcel A`line' = ("`varlabel'"),  font(Arial, 10)
		}
	local ++line
	putexcel A`line':E`line',  border(top) bold overwritefmt 
	/* Add a note below the table */
	putexcel A`line' = ("`note_`x''"),  nobold font(Arial, 9) // <-- add notes
	local ++line	
	local ++line
}

/* *********************************************************************
	PART 2: LATE PAYMENTS PREDICTORS
********************************************************************* */

// local sem "0715 0116 0716 0117 0717 0118 0718 0119"
local sem "0717 0118 0718 0119"

foreach x of local sem {
	reg snap_change_`x' pop_un_st_per
	est store reg`x'
	}

estout reg* using "${save_reg}" , cells(    b( fmt(%9.2f)  star ) p(fmt(%9.2f) par )  ) starlevels( * 0.10 ** 0.05 *** 0.010) ///
	stats(r2 N, fmt(%11.3f %11.0f) labels("R-squared" "N") ) legend label style(tab) varlabels(_cons Constant) replace 

