#!/usr/bin/env python
# coding: utf-8

# In[4]:


from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from bs4 import BeautifulSoup
import re
import pandas as pd
import os

from selenium.webdriver.chrome.options import Options
opts = Options()
opts.add_argument("user-agent=vietvv")


# In[13]:


driver = webdriver.Chrome("C:\Program Files (x86)\Google\Chrome\Application\chromedriver.exe",options=opts)


# In[14]:


url = "https://ncov.moh.gov.vn/"
driver.get(url)
content = driver.page_source
soup = BeautifulSoup(content)


# In[15]:


table=soup.find_all(id='sailorTable',attrs={'class':"table table-striped table-covid19"})


# In[16]:


tinh_thanh_pho=[]
so_ca_nhiem=[]
dang_dieu_tri=[]
khoi=[]
tu_vong=[]
data_1=table[0].find('tbody') #this is table 1

#Navigate the data from table 1 and fit them to the lists above
for row in data_1.find_all('tr'):
    tinh_thanh_pho.append(row.find_all('td')[0].string)
    so_ca_nhiem.append(row.find_all('td')[1].string)
    dang_dieu_tri.append(row.find_all('td')[2].string)
    khoi.append(row.find_all('td')[3].string)
    tu_vong.append(row.find_all('td')[4].string)


# In[17]:


#Create a pd dataframe for table 1
df_1=pd.DataFrame({'Province':tinh_thanh_pho,'Confirm':so_ca_nhiem,'Active':dang_dieu_tri,'Recovered':khoi,'Death':tu_vong})


# In[18]:


#Extract the data to a csv file
df_1.to_csv('covid19_province.csv',encoding="utf-8")


# In[19]:


benh_nhan=[]
tuoi=[]
gioi_tinh=[]
dia_diem=[]
tinh_trang=[]
quoc_tich=[]
data_2=table[1].find('tbody') #this is table 2

#Navigate the data from table 2 and fit them to the lists above
for row in data_2.find_all('tr'):
    benh_nhan.append(row.find_all('td')[0].string)
    tuoi.append(row.find_all('td')[1].string)
    gioi_tinh.append(row.find_all('td')[2].string)
    dia_diem.append(row.find_all('td')[3].string)
    tinh_trang.append(row.find_all('td')[4].string)
    quoc_tich.append(row.find_all('td')[5].string)


# In[20]:


#Create a pd dataframe for table 2
df_2=pd.DataFrame({'PatientID':benh_nhan,'Age':tuoi,'Sex':gioi_tinh,'Location':dia_diem,'Status':tinh_trang,'Nationality':quoc_tich})


# In[23]:


#Extract the data to a csv file
df_2.to_csv("covid19_patient.csv",encoding="utf-8")


# In[ ]:




