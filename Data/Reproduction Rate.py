#!/usr/bin/env python
# coding: utf-8

# In[1]:


import numpy as np
import pandas as pd
dataset = pd.read_csv("./raw-reproduction-rate.csv")


# In[2]:


dataset.head()
# I am interested in date, region, mean, lower_80, upper_80


# In[3]:


df_trim = dataset[['date', 'region', 'mean', 'lower_80', 'upper_80']]
df_trim.head()


# In[4]:


# Let's find out which "regions" are located in this dataset
df_trim['region'].unique()


# In[5]:


# df_trim2 is 0.2, without DC data
df_trim2 = df_trim[df_trim.region != 'DC']
df_trim2['region'].unique().size


# In[6]:


# Let's check for missing/null values
df_trim2.isnull().sum()


# In[7]:


# Let's do three more things
# 1. Change the name of region->state
# 2. Create a dictionary and transform "NY" => "New York"
# 3. Round each mean, lower_80, and upper_80 to 2 sigdif


# In[8]:


# 1. Change the name of region->state
df_trim3 = df_trim2.rename({'region': 'state'}, axis=1)
df_trim3.head()


# In[9]:


# 2. Create a dictionary and transform "NY" => "New York"
dict = {'ME': 'Maine', 'NH': 'New Hampshire', 'VT': 'Vermont', 'MA': 'Massachusetts', 'RI': 'Rhode Island',
       'CT': 'Connecticut', 'NY': 'New York', 'NJ': 'New Jersey', 'PA': 'Pennsylvania', 'DE': 'Delaware', 'MD': 'Maryland',
       'VA': 'Virginia', 'NC': 'North Carolina', 'SC': 'South Carolina', 'GA': 'Georgia', 'FL': 'Florida', 'KY': 'Kentucky',
       'WV': 'West Virginia', 'OH': 'Ohio', 'IN': 'Indiana', 'MI': 'Michigan',
       'AL': 'Alabama', 'TN': 'Tennessee', 'IL': 'Illinois', 'WI': 'Wisconsin', 'MN': 'Minnesota', 'MS': 'Mississippi', 'IA': 'Iowa',
       'MO': 'Missouri', 'AR': 'Arkansas', 'LA': 'Louisiana', 'ND': 'North Dakota',
       'SD': 'South Dakota', 'NE': 'Nebraska', 'KS': 'Kansas', 'OK': 'Oklahoma', 'TX': 'Texas', 'NM': 'New Mexico', 'CO': 'Colorado',
       'WY': 'Wyoming', 'MT': 'Montana', 'ID': 'Idaho', 'UT': 'Utah',
       'AZ': 'Arizona', 'WA': 'Washington', 'OR': 'Oregon', 'NV': 'Nevada', 'CA': 'California', 'AK': 'Alaska', 'HI': 'Hawaii'}
df_trim4 = df_trim3.replace({'state': dict});
df_trim4.head()


# In[10]:


# 3. Round each mean, lower_80, and upper_80 to 2 sigdif
df_trim5 = df_trim4.round(2)
df_trim5.head()


# In[11]:

# Save file
df_trim5.to_csv('./reproduction-rate.csv', index=False)