import React from 'react';

const About = () => {
    return(
        <div>
            <section>
                <h2>COVID-19 Insights</h2>
                <p>COVID Insights is a data visualization dashboard that provides analysis on the ongoing pandemic in the United States. The key motivation is to display the data in a clear manner to help the public monitor COVID-19.</p>
            </section>
            <section>
                <h2>Data Sources</h2>
                <p>Caseload data (cases, deaths) are sourced from the New York Times.</p>
                <p>Contact Tracing Data - testandtrace.com</p>
                <p>Test results data - The COVID Tracking Project</p>
                <p>Infection rate data - rt.live</p>
            </section>
            <section>
                <h2>Data Transformations</h2>
                <p>A majority of the data that I accessed was in a raw form and required cleaning and transformation in order to be used on the client side application. </p>
            </section>
            <section>
                <h2>Limitations of my analysis</h2>
                <p>Given that this is a novel and ongoing situation, my analysis is only as good as the data I have sourced. I am also in the process of streamlining my data flow in order to facilitate improved testing coverage and reliability. Please give me feedback on my data transformations, it would really help ensure this project is providing the most accurate snapshots of the pandemic.</p>
            </section>
            <section>
                <h2>Thanks</h2>
                <p>I’d like to thank covidactnow.org for guiding my inspiration during my brainstorming. Your UX/UI promotes quick navigation and clear understanding of complex data. Your platform gave me some helpful guidance on how best to layout the information.</p>
                <p>I’d like to also thank the endless hardwork that has been put into this data collection effort upstream. From the frontline medical workers to data aggregators. This project would not have been possible without you all. </p>
            </section>
        </div>
    )
}

export default About;