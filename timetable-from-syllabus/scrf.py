#scraping functions .py
from urllib.request import urlopen
from bs4 import BeautifulSoup
import json    
import re

def get_all_classes(html):
    html = urlopen(html)
    # [['1'], ['基礎セミナーＡ', 'First Year Seminar A'], ['./00_2021_X110000011411.html'], ['Ⅰ 月曜日 ４時限', 'I Mon 4'], ['齋藤\u3000永宏 ○', 'SAITO Nagahiro ○']],
    bs = BeautifulSoup(html, 'html.parser')
    i = []
    link = []
    k = 0
    href = ''
    count = 0
    for con in bs.find('tr',{'class':'label'}).next_siblings:
        if str(type(con)) == '\<class \'bs4.element.NavigableString\'\>':
            print(type(con))
        elif type(con) == None:
            print('NONE')
        else:
            try:
                l = -1
                if i == []:  
                    i.append([]) 
                    continue
                for li in con.children:
                    if li.name == 'td':
                        i[k].append(li.getText(',').split(','))
                        if li.a:
                            href = li.a.attrs['href']
                            i[k].append([href])
                            link.append(href)
                    l += 1
            except AttributeError as e:
                print(e)
            k += 1
            i.append([]) 

    return i
def get_class_name(period,day,hour,*class_list,type = 'ja'):
    #I Mon 4の形式で入力
    #returnの形式
    #['基礎セミナーＡ', '吉田\u3000早悠里', './00_2021_X110000012401.html']
    if not isinstance(class_list,tuple):
        print('get_class_name: NO LIST!')
        return
    return_list = []
    periods = {
        'I':['I', 'Spring'],
        'II':['II','Fall'],#,'Ⅱ'
        'III':['III','Spring'],#,'Ⅲ'
        'IV':['IV','Fall']#,'Ⅳ'
    }
    nums = {#全角と半角切り替え用
        '１': '1', #全角→半角
        '２': '2',
        '３': '3',
        '４': '4',
        '５': '5',
        '６': '6',
        '７': '7',
    }
    try:
        hour = nums[hour]
    except:
        pass

    if periods[period] is None:
        print('学期の入力はIかIIでお願いします．')
        return None

    for period in periods[period]:
        text = str(period + ' '+ day + ' '  + hour )
        #text = str(period + ' '+ day + '曜日'+ ' '  + hour + '時限')
        print(text)
        #ptn = re.compile(text)
        if(type == 'ja'):
            for i in class_list:
                #print(i[3][0])
                if i != []:#この実装あまりよろしくないのでは
                    ptn = re.compile(i[3][1])
                    if ptn.search(text):#3,1なら英語検索，3,0なら日本語検索
                        return_list.append([i[1][0],i[4][0].replace(' ○',''),i[2][0]])
                else:
                    break
        elif(type == 'en'):
            for i in class_list:
                ptn = re.compile(i[3][1])
                if ptn.search(text):
                    return_list.append([i[1][1],i[4][1].replace(' ○',''),i[2][0]])
            else:
                break  
    return return_list


def get_all_courses(html):
    # ['基礎セミナー,First Year Seminar', './00_2021_X11000.html'], 
    html = urlopen(html)
    bs = BeautifulSoup(html, 'html.parser')
    class_type_list = []
    link = []
    k = 0
    i = 0
    type_class = ''
    for chld in bs.find('td',{'id': 'main'}).children:
        try:
            type_class = chld.find('table',{'class': 'list'})
            if(type_class):
                k += 1
                continue
        except TypeError as e:
            pass
        if(k == 2 and type_class != None):
            for sib in type_class.find('tr').next_siblings:
                #print(sib)
                try:
                    #print(sib.find('td').getText(','))
                    class_type_list.append([sib.find('td').getText(','), sib.find('td').a.attrs['href']])
                    #print(sib.find('td').a.attrs['href'])
                except AttributeError as a:
                    #print(a)
                    pass
            i += 1
    return class_type_list

# html = urlopen('https://syllabus.adm.nagoya-u.ac.jp/data/2021/00_2021_X220000013121.html')

def class_detail(html):
    html = urlopen(html)
    #基セミだけ枠が多いのに注意
    #['学部・大学院区分', 'Undergraduate / Graduate', '学部'],
    #['授業の目的\u3000【日本語】', 'Goals of the Course [JPN]', '本授業科目は、人文・社会科学系分野の諸現象について、それらの諸現象を学際的、総合的に分析、把握する能力を育むとともに、他の学問分野との関連性について理解することが目的である。'], ['本授業科目は、人文・社会科学系分野の諸現象について、それらの諸現象を学際的、総合的に分析、把握する能力を育むとともに、他の学問分野との関連性について理解することが目的である。'],
    bs = BeautifulSoup(html, 'html.parser')
    list_about = []
    list_detail= []
    flag = True
    bs1 = bs.find('td', {'id': 'main'}).find_all('table',{'class':'syllabus_detail'})
    for al in bs1:
        for bl in al.find_all('tr'):
            if(bl.getText(',')!=''):
                if flag:
                    list_about.append(bl.getText(',').split(','))
                else:
                    list_detail.append(bl.getText(',').split(','))
        flag = False
    return [list_about, list_detail]

def class_purpose(lastHTML, year='2021'):
    if lastHTML[0] == '.':
        lastHTML.replace('.','',1)
    html = urlopen('https://syllabus.adm.nagoya-u.ac.jp/data/' + year + '/' + lastHTML)
    purpose = class_detail(html)[1][0][2]
    return purpose


def convert_json(base):
    return json.dumps(base)

def convert_roman_to_arabic(num):
    dict = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    sum = 0
    y = 0 # 比較用の変数
    for i in num[::-1]: # sは入力された文字列のこと
        if y <= dict[i] or y == 0:
            sum += dict[i]
            y = dict[i]
        else:
            sum -= dict[i]
    return sum
        
if __name__ == '__main__':
    pass