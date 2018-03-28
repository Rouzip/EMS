drop table absences;
drop table extraWorks;
drop table employees;
drop table positions;
drop table departments;

select * from absences;
select * from extraWorks;
select * from employees;
select * from positions;
select * from departments;

insert into positions values(1, '初级工程师', 3000);
insert into positions values(2, '架构师', 3000);
insert into positions values(3, '部门经理', 3000);


insert into departments values(1, '开发部', 300);
insert into departments values(2, '宣传部', 400);
insert into departments values(3, '销售部', 800);
insert into departments values(4, 'test1', 300);
insert into departments values(5, 'test2', 400);
insert into departments values(6, 'test3', 800);
insert into departments values(7, 'test4', 300);
insert into departments values(8, 'test5', 400);
insert into departments values(9, 'test6', 800);

    
insert into employees values('1057f740-2k74-11e8-8bdf-9f0e3d95a8ea', '拉拉', '女', '5', 1, 2);
insert into employees values('2257f740-2e74-11e5-8bdf-9f0e3d95a8ea', '月月', '男', '5', 2, 1);
insert into employees values('2057f740-2e74-11e8-8bdf-9f0e3d95a8ea', '黑黑', '男', '5', 2, 1);
insert into employees values('2037f740-2e74-11e8-8bhf-9f0e3d95a8ea', '叶子', '女', '5', 1, 2);
insert into employees values('2054f740-2e74-11h8-8bdf-9f0e3d95a8ea', '小虎', '男', '5', 3, 2);
insert into employees values('20575740-2e74-s1e8-8bdf-9f0e3d95a8ea', '本本', '男', '5', 2, 2);
insert into employees values('2057f640-2e74-11j8-8bdf-9f0e3d95a8ea', '龙则罗拉', '男', '5', 3, 2);
insert into employees values('2057f770-2e74-1he8-8bdf-9f0e3d95a8ea', '仓空井', '女', '5', 1, 2);
insert into employees values('1057f748-2k74-11e8-8bdf-9f0e3d95a8ea', '拉拉是', '女', '5', 2, 2);
insert into employees values('2257f740-1e74-11e5-8bdf-9f0e3d95a8ea', '月月的', '男', '5', 3, 1);
insert into employees values('2057f740-2274-11e8-8bdf-9f0e3d95a8ea', '黑黑u', '男', '5', 3, 1);
insert into employees values('2037f740-2e34-11e8-8bhf-9f0e3d95a8ea', '叶页', '女', '5', 1, 2);
insert into employees values('2054f740-2e7p-11h8-8bdf-9f0e3d95a8ea', '小与虎', '男', '5', 1, 3);
insert into employees values('20575740-2e74-51e8-8bdf-9f0e3d95a8ea', '本啊本', '男', '5', 1, 3);
insert into employees values('2057f640-2e74-18j8-8bdf-9f0e3d95a8ea', '罗拉', '男', '5', 1, 2);
insert into employees values('2057f770-2e74-1hp8-8bdf-9f0e3d95a8ea', '仓井', '女', '5', 1, 3);

    
insert into extraWorks values('1f1230d0-2e74-11e8-8bdf-9f0e3d95a8ea', 'bug', 4, 2018, 2, 22, 400, '1057f740-2k74-11e8-8bdf-9f0e3d95a8ea');
insert into extraWorks values('1f3230d0-2e74-11e8-8bdf-9f0e3d95a8ea', 'bug', 2, 2018, 3, 23, 300, '2037f740-2e74-11e8-8bhf-9f0e3d95a8ea');
insert into extraWorks values('1f8230d0-2e74-11e8-8bdf-9f0e3d95a8ea', 'bug', 1, 2018, 4, 24, 400, '2057f770-2e74-1hp8-8bdf-9f0e3d95a8ea');


insert into absences values(1, 2018, 3, 23, '2054f740-2e74-11h8-8bdf-9f0e3d95a8ea');
insert into absences values(2, 2018, 3, 22, '2054f740-2e74-11h8-8bdf-9f0e3d95a8ea');
insert into absences values(3, 2018, 1, 23, '2057f740-2e74-11e8-8bdf-9f0e3d95a8ea');
insert into absences values(4, 2018, 2, 22, '2257f740-1e74-11e5-8bdf-9f0e3d95a8ea');
insert into absences values(5, 2018, 6, 23, '2057f770-2e74-1hp8-8bdf-9f0e3d95a8ea');
insert into absences values(6, 2018, 7, 12, '20575740-2e74-51e8-8bdf-9f0e3d95a8ea');

