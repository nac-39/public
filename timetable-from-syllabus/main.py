from scrf import *
from classes import *


CLS = Subject('言語文化')
hoge = CLS.classes('I','Tue','１')
if hoge:
    for i in hoge:
        print(i)

'''
検索して出てくる三つ目の./から始まるURLはピリオドをとって，
https://syllabus.adm.nagoya-u.ac.jp/data/2021/
の後にくっつけるとクラスの詳細にアクセスできます．
'''

### Subjectクラスの引数
# 基礎セミナー
# First Year Seminar	
# 言語文化
# Language and Culture	
# 健康・スポーツ科学（講義）
# Health and Sports Science: Lecture	
# 健康・スポーツ科学（実習）
# Health and Sports Science: Practicum	
# 文系基礎科目
# Basic Courses in Humanities and Social Sciences	
# 文系教養科目
# Liberal Education Courses in Humanities and Social Sciences	
# 理系基礎科目
# Basic Courses in Natural Sciences	
# 理系教養科目
# Liberal Education Courses in Natural Sciences	
# 全学教養科目
# Liberal Education Courses in Interdisciplinary Fields	
# 開放科目
# Open Courses	
# 随意科目
# Optional Subject	
# 教養教育院（院）
# Institute of Liberal Arts and Sciences	
# 専門科目
# Course Subjects	
# 他専攻等科目
# Other Major Courses	
# 他研究科等科目
# Other Graduate Schools Courses	
# 他研究科等科目
# Courses in Other Graduate School	
# 基盤科目（全研究科共通科目）
# Basic Courses (NU Common)	
# 随意科目
# Optional Subject	




