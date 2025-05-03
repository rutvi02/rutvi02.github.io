---
layout: page
title: "Home"
class: home
---

# Hi, I'm Sargun!

<div class="columns" markdown="1">

<div class="intro" markdown="1">
I am a **Master's in Data Science** student at the [NYU Center for Data Science](https://cds.nyu.edu) and bring 3+ years of hands-on experience specializing in **Machine Learning and NLP**. As a Data Science Intern at [Marsh McLennan](https://en.wikipedia.org/wiki/Marsh_McLennan) (NY), I led the development of an impactful industry benchmarking pipeline, leveraging LLMs, Clustering, and Hypothesis Testing, showcasing my ability to translate raw data into actionable insights for business stakeholders.

Preceding my Master’s, I spent 2 years as a **Data Scientist** at [Fidelity Investments](https://fcatalyst.com/overview), pioneering data products that saved time and money for financial advisors and analysts. My contributions spanned Document Information Extraction, Text Summarization, and Email Fraud Detection.

I love working on data for social good projects and as a **Research Engineer**, I published research papers on Statistics and ML for COVID-19 caseload prediction and devising interventions to mitigate infection outbreaks.

</div>

<!-- <div class="intro" markdown="1">
I am currently pursuing my **Master's in Data Science** at the [NYU Center for Data Science](https://cds.nyu.edu), graduating in May 2024. I have **3+ years** of experience in Data Science, specializing in building **Machine Learning and Natural Language Processing** products.

In the summer, I interned at [Marsh McLennan](https://en.wikipedia.org/wiki/Marsh_McLennan) (NY) as a Data Science Intern, working on peer grouping of insurance clients based on their claims data, leveraging LLMs, Clustering, and Hypothesis Testing.

Prior to my Master's, I worked as a **Data Scientist** for 2 years at [Fidelity Investments](https://fcatalyst.com/overview), developing solutions for Document Information Extraction, Text Summarization, Email Fraud Detection, Explainable AI and more.

In addition, I have 1 year of experience conducting research in the area of **ML for social good**. As a **Research Scientist** at [ML2CT Lab, Ashoka](https://ashoka.edu.in/ML2CT), I worked on the statistical modelling of contact mixing patterns to devise interventions to limit the spread of infectious diseases. At [TavLab, IIIT-Delhi](http://tavlab.iiitd.edu.in/), I used ML to build predictive models for COVID-19 caseload predicion and surveillance of emerging variants.

</div> -->

<div class="me" markdown="1">
<picture>
  <source srcset='/images/sargun-nagpal.jpeg' type='image/jpeg' />
  <img
    src='/images/sargun-nagpal.jpeg'
    alt='Sargun Nagpal'>
</picture>

{:.no-list}
* <a href="mailto:{{ site.email }}">{{ site.email }}</a>
</div>
</div>

## Featured Projects

<div class="featured-projects">
  {% assign sorted_projects = site.data.projects | sort: 'highlight' %}
  {% for project in sorted_projects %}
    {% if project.highlight %}
      {% include project.html project=project %}
    {% endif %}
  {% endfor %}
</div>
<a href="{{ "/projects/" | relative_url }}" class="button">
  <i class="fas fa-chevron-circle-right"></i>
  Show More Projects
</a>

## Featured Publications

<div class="featured-publications">
  {% assign sorted_publications = site.publications | sort: 'year' | reverse %}
  {% for pub in sorted_publications %}
    {% if pub.highlight %}
      <a href="{{ pub.pdf }}" class="publication">
        <strong>{{ pub.title }}</strong>
        <span class="authors">{% for author in pub.authors %}{{ author }}{% unless forloop.last %}, {% endunless %}{% endfor %}</span>.
        <i>{% if pub.venue %}{{ pub.venue }}, {% endif %}{{ pub.year }}</i>.
        {% for award in pub.awards %}<br/><span class="award"><i class="fas fa-{% if award == "Best Paper Award" %}trophy{% else %}award{% endif %}" aria-hidden="true"></i> {{ award }}</span>{% endfor %}
      </a>
    {% endif %}
  {% endfor %}
</div>

<a href="{{ "/publications/" | relative_url }}" class="button">
  <i class="fas fa-chevron-circle-right"></i>
  Show All Publications
</a>

<!-- <div class="news-travel" markdown="1">

<div class="news" markdown="1">
## Latest News

<ul>
{% for news in site.data.news limit:10 %}
  {% include news.html news=news %}
{% endfor %}
</ul>

</div>

<div class="travel" markdown="1">
## Latest Travel

<table>
<tbody>
{% assign future_travel = site.data.travel | where_exp:'item','item.start == null' %}
{% for travel in future_travel %}
  {% include travel.html travel=travel %}
{% endfor %}
{% assign sorted_travel = site.data.travel | where_exp:'item','item.start' | sort: 'start' | reverse %}
{% for travel in sorted_travel limit:10 %}
  {% include travel.html travel=travel %}
{% endfor %}
</tbody>
</table>

</div>

</div> -->
