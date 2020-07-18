#!/usr/bin/env python
# coding: utf-8

# In[1]:


import numpy as np
import pandas as pd
dataset = pd.read_csv("./daily.csv")


# In[2]:


df1 = dataset.iloc[:, 0:4]


# In[3]:


df1 = df1[df1.state != 'AS']
df1 = df1[df1.state != 'DC']
df1 = df1[df1.state != 'GU']
df1 = df1[df1.state != 'MP']
df1 = df1[df1.state != 'PR']
df1 = df1[df1.state != 'VI']


# In[4]:


df1 = df1.fillna(0)


# In[5]:


df1['positive-test-rate'] = round(df1['positive']/(df1['positive'] + df1['negative']), 2)
df1 = df1.fillna(0)


# In[9]:


df1.isnull().sum()


# In[8]:


df1.to_csv('./positive-test-rate2.csv', index=False)


# In[ ]:




