select sess.fiscal_year,        
       sess.skill_name,        
       sess.prof_skill_overall_name as proficiency,
       sum(sess.salaried_ind) as fte 
from dm_hr_gold.v_supply_emp_skills_swfp sess 
where lower(left(sess.grade,1)) <> 'e' 
group by sess.fiscal_year, sess.skill_name, sess.prof_skill_overall_name 
order by 1 desc, 2 asc;