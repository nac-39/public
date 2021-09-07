from scrf import *
from abc import ABC

class Subject():
    BASE_URL = 'https://syllabus.adm.nagoya-u.ac.jp/data/2021'
    TOP_URL = 'https://syllabus.adm.nagoya-u.ac.jp/data/2021/00_2021.html'
    

    def __init__(self,LAS):#LAS= Liberal Arts and Science
        self.LAS = LAS
        course = get_all_courses(self.TOP_URL)
        _ALL_CLASSES_URL = self.course_find(self.LAS, *course)
        self.all = get_all_classes(_ALL_CLASSES_URL)

    def course_find(name, *course):
        BASE_URL = 'https://syllabus.adm.nagoya-u.ac.jp/data/2021'
        name = course[0]
        newcourse = course[1::1]
        for i in range(len(newcourse)):
            li = newcourse[i][0].split(',')
            if (li[0]==name)or(li[1]==name):
                if newcourse[i][1][0] == '.':
                    newcourse[i][1][0].replace('.','',1)
                html = BASE_URL+ '/'+ newcourse[i][1]
                return html

    def classes(self,period,day,hour,type = 'ja'):
        #引数はstring型にせよ．
        class_list = self.all
        a = get_class_name(period,day,hour,*class_list,type)
        if a == []:
            print('その時間に該当授業はありません．')
            return None
        else: return a