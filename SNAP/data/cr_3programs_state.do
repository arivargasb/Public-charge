/* PROGRAM DESCRIPTION
program: cr_SNAP_county_clean_4largest.do
task: cleans SNAP data at the county level for CA, IL, TX & FL

organization:
		0 : setup tasks like directory structure, input & output file names, other useful locals
		1 : Import SNAP datasets and clean
		2 : Merge Census data
		3 : Merge data on undocumented population
		
	 
*/
/* *********************************************************************
	PART 0: PREAMBLE
********************************************************************* */

* 0.1: PREFERENCES
clear all
set more off
set varabbrev on

* 0.2: DIRECTORIES
global base_dir_ari 		"/Users/ariadna/Box Sync/public charge blog/data/" 
global base_dir_aridesk 	"/Users/ariadnavargas/Box Sync/public charge blog/data/" 

cd "${base_dir_ari}"

* 0.3: FILE NAMES

* INPUTS
global read_medicaid	"raw/State_Medicaid_and_CHIP_Applications__Eligibility_Determinations__and_Enrollment_Data (2).csv"
global read_wic_2017	"raw/WICAgencies2017ytd-9.xls"
global read_wic_2018	"raw/WICAgencies2018ytd-9.xls"
global read_wic_2019	"raw/WICAgencies2019ytd-9.xls"
global read_snap		"clean/snap_state.dta"
global read_snap_fy1819	 "raw/snap_st_FY18&FY19.xlsx"
global read_undoc		"raw/State-County-Unauthorized-Estimates-2016.xlsx"
global read_cen				"raw/census_county.csv"

* OUTPUTS
global save				"clean/3programs_state.dta"
global save_medicaid	"clean/medicaid_state.dta"
global save_wic			"clean/wic_state.dta"
global save_snap			"clean/snap_state_mnth.dta"


/****************************************
 1. Import Medicaid data
****************************************/
import delimited "${read_medicaid}", encoding(ISO-8859-1)clear

drop if reportdate=="09/01/13"
keep if final_report=="Y"
keep stateabbreviation statename reportdate totalmedicaidenrollment /// 
totalmedicaidenrollment latitude longitude

rename stateabbreviation state_abbrev 
rename statename state_name
rename totalmedicaidenrollment med_beneficiaries_ 


gen sem= "0717" if reportdate=="07/01/17"
replace sem= "0118" if reportdate=="01/01/18"
replace sem= "0718" if reportdate=="07/01/18"
replace sem= "0119" if reportdate=="01/01/19"
drop if sem==""
label var sem "Semester"
drop reportdate

reshape wide med_, ///
i(state_name) j(sem) string

gen med_biannual_chan_0118 = 100* ((med_beneficiaries_0118/med_beneficiaries_0717)-1)
gen med_biannual_chan_0718 = 100* ((med_beneficiaries_0718/med_beneficiaries_0118)-1)
gen med_biannual_chan_0119 = 100* ((med_beneficiaries_0119/med_beneficiaries_0718)-1)

label var med_biannual_chan_0118 "Change in Medicaid beneficiaries 0717-0118"
label var med_biannual_chan_0718 "Change in Medicaid beneficiaries 0118-0718"
label var med_biannual_chan_0119 "Change in Medicaid beneficiaries 0718-0719"

save "${save_medicaid}", replace

save "${save}", replace


/****************************************
 2. Import WIC data
****************************************/

import excel "${read_wic_2017}" , sheet("Total Number of Participants") cellrange(A5:N98) firstrow clear

rename State state_name
drop if B==.
drop  B C D Average
rename E wic_beneficiaries_0117 
rename F wic_beneficiaries_0217 
rename G wic_beneficiaries_0317 
rename H wic_beneficiaries_0417 
rename I wic_beneficiaries_0517 
rename J wic_beneficiaries_0617 
rename K wic_beneficiaries_0717 
rename L wic_beneficiaries_0817 
rename M wic_beneficiaries_0917 

foreach i in ///
"Ute Mountain Ute Tribe, CO" "Omaha Sioux, NE" "Santee Sioux, NE" ///
"Winnebago Tribe, NE" "Standing Rock Sioux Tribe, ND" "Three Affiliated Tribes, ND" ///
"Cheyenne River Sioux, SD" "Rosebud Sioux, SD" "Northern Arapahoe, WY" ///
"Shoshone Tribe, WY" "Mountain Plains" "Acoma, Canoncito & Laguna, NM" ///
"Eight Northern Pueblos, NM" "Five Sandoval Pueblos, NM" "Isleta Pueblo, NM" ///
"San Felipe Pueblo, NM" "Santo Domingo Tribe, NM" "Zuni Pueblo, NM" ///
"Cherokee Nation, OK" "Chickasaw Nation, OK" "Choctaw Nation, OK" ///
"Citizen Potawatomi Nation, OK" "Inter-Tribal Council, OK" "Muscogee Creek Nation, OK" ///
"Osage Tribal Council, OK" "Otoe-Missouria Tribe, OK" "Wichita, Caddo & Delaware (WCD), OK" ///
"Southwest Region" "Midwest Region" "Southeast Region" "Choctaw Indians, MS" ///
"Eastern Cherokee, NC" "Mid-Atlantic Region" "Indian Township, ME" "Pleasant Point, ME" ///
"Seneca Nation, NY" "Northeast Region"  "Hawaii" "Guam" "Virgin Islands" "Puerto Rico" {
		drop if state_name=="`i'"
	}	

save "${save_wic}" , replace
		
import excel "${read_wic_2018}" , sheet("Total Number of Participants") cellrange(A5:N97) firstrow clear

rename State state_name
drop if B==.
drop Averag

rename B wic_beneficiaries_1017 
rename C wic_beneficiaries_1117 
rename D wic_beneficiaries_1217 
rename E wic_beneficiaries_0118
rename F wic_beneficiaries_0218
rename G wic_beneficiaries_0318
rename H wic_beneficiaries_0418
rename I wic_beneficiaries_0518
rename J wic_beneficiaries_0618
rename K wic_beneficiaries_0718
rename L wic_beneficiaries_0818
rename M wic_beneficiaries_0918
 
foreach i in ///
"Ute Mountain Ute Tribe, CO" "Omaha Sioux, NE" "Santee Sioux, NE" ///
"Winnebago Tribe, NE" "Standing Rock Sioux Tribe, ND" "Three Affiliated Tribes, ND" ///
"Cheyenne River Sioux, SD" "Rosebud Sioux, SD" "Northern Arapahoe, WY" ///
"Shoshone Tribe, WY" "Mountain Plains" "Acoma, Canoncito & Laguna, NM" ///
"Eight Northern Pueblos, NM" "Five Sandoval Pueblos, NM" "Isleta Pueblo, NM" ///
"San Felipe Pueblo, NM" "Santo Domingo Tribe, NM" "Zuni Pueblo, NM" ///
"Cherokee Nation, OK" "Chickasaw Nation, OK" "Choctaw Nation, OK" ///
"Citizen Potawatomi Nation, OK" "Inter-Tribal Council, OK" "Muscogee Creek Nation, OK" ///
"Osage Tribal Council, OK" "Otoe-Missouria Tribe, OK" "Wichita, Caddo & Delaware (WCD), OK" ///
"Southwest Region" "Midwest Region" "Southeast Region" "Choctaw Indians, MS" ///
"Eastern Cherokee, NC" "Mid-Atlantic Region" "Indian Township, ME" "Pleasant Point, ME" ///
"Seneca Nation, NY" "Northeast Region" "Hawaii" "Guam" "Virgin Islands" "Puerto Rico"  {
		drop if state_name=="`i'"
	}	
	
merge 1:1 state_name using "${save_wic}"
drop _merge 

save "${save_wic}" , replace
		
		
import excel "${read_wic_2019}" , sheet("Total Number of Participants")  cellrange(A5:K98) firstrow  clear

rename State state_name
drop if B==.
drop  Average
rename B wic_beneficiaries_1018
rename C wic_beneficiaries_1118
rename D wic_beneficiaries_1218
rename E wic_beneficiaries_0119 
rename F wic_beneficiaries_0219 
rename G wic_beneficiaries_0319 
rename H wic_beneficiaries_0419 
rename I wic_beneficiaries_0519 
rename J wic_beneficiaries_0619 
foreach i in ///
"Ute Mountain Ute Tribe, CO" "Omaha Sioux, NE" "Santee Sioux, NE" ///
"Winnebago Tribe, NE" "Standing Rock Sioux Tribe, ND" "Three Affiliated Tribes, ND" ///
"Cheyenne River Sioux, SD" "Rosebud Sioux, SD" "Northern Arapahoe, WY" ///
"Shoshone Tribe, WY" "Mountain Plains" "Acoma, Canoncito & Laguna, NM" ///
"Eight Northern Pueblos, NM" "Five Sandoval Pueblos, NM" "Isleta Pueblo, NM" ///
"San Felipe Pueblo, NM" "Santo Domingo Tribe, NM" "Zuni Pueblo, NM" ///
"Cherokee Nation, OK" "Chickasaw Nation, OK" "Choctaw Nation, OK" ///
"Citizen Potawatomi Nation, OK" "Inter-Tribal Council, OK" "Muscogee Creek Nation, OK" ///
"Osage Tribal Council, OK" "Otoe-Missouria Tribe, OK" "Wichita, Caddo & Delaware (WCD), OK" ///
"Southwest Region" "Midwest Region" "Southeast Region" "Choctaw Indians, MS" ///
"Eastern Cherokee, NC" "Mid-Atlantic Region" "Indian Township, ME" "Pleasant Point, ME" ///
"Seneca Nation, NY" "Northeast Region" "Hawaii" "Guam" "Virgin Islands" "Puerto Rico"  {
		drop if state_name=="`i'"
	}	
	
merge 1:1 state_name using "${save_wic}"
drop _merge 

save "${save_wic}", replace

gen wic_biannual_chan_0717 = 100* ((wic_beneficiaries_0717/wic_beneficiaries_0117)-1)
gen wic_biannual_chan_0118 = 100* ((wic_beneficiaries_0118/wic_beneficiaries_0717)-1)
gen wic_biannual_chan_0718 = 100* ((wic_beneficiaries_0718/wic_beneficiaries_0118)-1)
gen wic_biannual_chan_0119 = 100* ((wic_beneficiaries_0119/wic_beneficiaries_0718)-1)
label var wic_biannual_chan_0717 "Change in WIC beneficiaries 0117-0717"
label var wic_biannual_chan_0118 "Change in WIC beneficiaries 0717-0118"
label var wic_biannual_chan_0718 "Change in WIC beneficiaries 0118-0718"
label var wic_biannual_chan_0119 "Change in WIC beneficiaries 0718-0719"

// local month "0117" "0217 0317 0417 0517 0617 0717 0817 0917 1017 ///
// 1117 1217 0118 0218 0318 0418 0518 0618 0718 0818 0918 1018 1118 1218 ///
// 0119 0219 0319 0419 0519 0619"

forval x = 2/9 {
	local y=`x'-1
	gen wic_chan_0`x'17 = ((wic_beneficiaries_0`x'17/wic_beneficiaries_0`y'17)-1)*100
	label var wic_chan_0`x'17 "SNAP change in beneficiaries 0`x'17"
	gen wic_chan_0`x'18 = ((wic_beneficiaries_0`x'18/wic_beneficiaries_0`y'18)-1)*100
	label var wic_chan_0`x'18 "SNAP change in beneficiaries 0`x'18"
}

forval x = 11/12 {
	local y=`x'-1
	gen wic_chan_`x'17 = ((wic_beneficiaries_`x'17/wic_beneficiaries_`y'17)-1)*100
	label var wic_chan_`x'17 "SNAP change in beneficiaries `x'17"
	gen wic_chan_`x'18 = ((wic_beneficiaries_`x'18/wic_beneficiaries_`y'18)-1)*100
	label var wic_chan_`x'18 "SNAP change in beneficiaries `x'18"
}
	gen wic_chan_1017 = ((wic_beneficiaries_1017/wic_beneficiaries_0917)-1)*100
	label var wic_chan_1017 "SNAP change in beneficiaries 1017"


drop wic_beneficiaries*

save "${save_wic}" , replace

/****************************************
 3. Merge data of 3 programs
****************************************/

merge 1:1 state_name using "${save}"
keep if _merge==3
drop _merge
save "${save}", replace

// merge 1:1 state_name using "${read_snap}"
// drop if _merge==2
// drop _merge pop_st

forval x=16/18{
	local y=`x'-1
	local z = `x'+1
	label var snap_change_01`z'  "Change in SNAP beneficiaries 07`x'-01`z'"
	label var snap_change_07`x'  "Change in SNAP beneficiaries 01`x'-07`x'" 
	}
	

save "${save}", replace


import excel "${read_snap_fy1819}", sheet("2019") firstrow clear
replace month="Feb 2019" if month=="Feb 2019 /2"
replace month="Oct 2018" if month=="Oct-18"
replace month="Jan 2019" if month=="Jan 2019 /2"
save "${save_snap}", replace

import excel "${read_snap_fy1819}", sheet("2018") firstrow clear
append using "${save_snap}"

split month, p(" ")
drop month
gen month="01" if month1=="Jan"
replace month="02" if month1=="Feb"
replace month="03" if month1=="Mar"
replace month="04" if month1=="Apr"
replace month="05" if month1=="May"
replace month="06" if month1=="Jun"
replace month="07" if month1=="Jul"
replace month="08" if month1=="Aug"
replace month="09" if month1=="Sep"
replace month="10" if month1=="Oct"
replace month="11" if month1=="Nov"
replace month="12" if month1=="Dec"

replace month= month+"17" if month2=="2017"
replace month= month+"18" if month2=="2018"
replace month= month+"19" if month2=="2019"



/****************************************
 4. Merge data of undocumented population
****************************************/

import excel "${read_undoc}", sheet("U.S. and States") cellrange(A4:B54) firstrow clear

split State, parse(" ")

gen state_name=State1 
replace state_name=state_name + " " + State2 if  State2!=""
replace state_name=state_name + " " + State3 if  State3!=""
drop State*

rename TotalUn pop_un_st
label var pop_un_st "Unauthorized population - st"
drop if state_name=="United States"

merge 1:1 state_name using "${save}"
drop if _merge==1
drop _merge
save "${save}", replace

// Merge Census data

import delimited "${read_cen}", varnames(1) encoding(ISO-8859-1)clear

rename county county_id
rename state state_id

tostring county_id, format(%03.0f) replace
tostring state_id, format(%02.0f) replace

split state_name, parse(" ")
drop state_name
rename state_name1 state_name
replace state_name=state_name + " " + state_name2 if  state_name2!=""
replace state_name=state_name + " " + state_name3 if  state_name3!=""
drop state_name2 state_name3

rename population pop_co
label var pop_ "Total population - co"
collapse (sum) pop_co, by(state_name)

merge 1:1 state_name using "${save}"

gen pop_un_st_per = 100*(pop_un_st/pop_co)

drop if _merge==1
drop _merge
save "${save}", replace

