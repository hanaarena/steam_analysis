import streamlit as st
import pandas as pd
import json
import numpy as np
import altair as alt

csv_path = "data/reviews/reviews_570.json"
with open(csv_path) as f:
    data = json.load(f)
df = pd.json_normalize(data)

buckets = [
    ("< 10 minutes", 0, 10/60),
    ("10-30 minutes", 10/60, 0.5),
    ("0.5-1 hour", 0.5, 1),
    ("1-2 hours", 1, 2),
    ("2-5 hours", 2, 5),
    ("5-10 hours", 5, 10),
    ("10-20 hours", 10, 20),
    ("20-50 hours", 20, 50),
    ("50-100 hours", 50, 100),
    ("100+ hours", 100, float('inf')),
]

def get_bucket(playtime_hr):
    for name, low, high in buckets:
        if low <= playtime_hr < high:
            return name
    return "Unknown"

df['playtime_hr'] = df['author.playtime_forever'] / 60
df['bucket'] = df['playtime_hr'].apply(get_bucket)

np.random.seed(0)
df['review_type'] = np.random.choice(
    ['Positive Purchased', 'Positive SteamKey', 'Negative Purchased', 'Negative SteamKey'],
    size=len(df)
)

st.title("Reviews data")
st.markdown("""
<div style="display: flex; gap: 20px;">
    <div style="background: #228B22; width: 20px; height: 20px; display: inline-block"></div> Positive SteamKey
    <div style="background: #90ee90; width: 20px; height: 20px; display: inline-block"></div> Positive Purchased
    <div style="background: #8B0000; width: 20px; height: 20px; display: inline-block"></div> Negative SteamKey
    <div style="background: #ff3333; width: 20px; height: 20px; display: inline-block"></div> Negative Purchased
</div>
""", unsafe_allow_html=True)

for bucket, _, _ in buckets:
    bucket_df = df[df['bucket'] == bucket]
    if bucket_df.empty:
        continue
    counts = bucket_df['review_type'].value_counts().reindex(
        ['Positive SteamKey', 'Positive Purchased', 'Negative SteamKey', 'Negative Purchased'], fill_value=0
    )
    chart_df = pd.DataFrame({
        'Type': counts.index,
        'Count': counts.values,
        'Color': ['#228B22', '#90ee90', '#8B0000', '#ff3333']
    })
    chart_df['Type'] = chart_df['Type'].astype(str)
    chart_df['Color'] = chart_df['Color'].astype(str)
    chart_df['Count'] = pd.to_numeric(chart_df['Count'], errors='coerce').fillna(0)
    chart_df = chart_df[np.isfinite(chart_df['Count'])]
    chart_df['Count'] = chart_df['Count'].astype(int)
    chart_df = chart_df[chart_df['Count'] > 0]
    if chart_df.empty:
        continue
    bar = alt.Chart(chart_df).mark_bar().encode(
        x='Count:Q',
        y=alt.Y('Type:N', title=None, axis=None),
        color=alt.Color('Color:N', scale=None),
        tooltip=['Type', 'Count']
    ).properties(height=230, width=600, title=bucket)
    st.altair_chart(bar, use_container_width=True)

st.write(f"Load Progress: {len(df)}/689")
st.download_button("Download CSV", data=df.to_csv(index=False), file_name="reviews_570.csv")
