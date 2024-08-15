/* eslint-disable no-loop-func */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment'; // Import moment.js for date-time formatting
import {  LuArrowDownRight, LuArrowUp10, LuArrowUpRight, LuUserCircle } from "react-icons/lu";
import { TiGroup } from 'react-icons/ti';
import { BiEdit } from 'react-icons/bi';


function App() {

  const [data, setData] = useState([]);

  // states for analysis
  const [averageSales, setAverageSales] = useState(0);
  const [minSales, setMinSales] = useState(Number.POSITIVE_INFINITY); 
  const [maxSales, setMaxSales] = useState(Number.NEGATIVE_INFINITY);

  useEffect(() => {
    axios.get('https://django-dev.aakscience.com/candidate_test/fronted')
      .then(response => {
        
        const res = response.data;
        const datesValuePairs = [];
        let totalSales = 0;
        let salesCount = 0;
        let currMinSales = Number.POSITIVE_INFINITY;
        let currMaxSales = Number.NEGATIVE_INFINITY;

        res.forEach(years => {
          for (const year in years) {
            years[year].forEach(months => {
              for (const month in months) {
                months[month].forEach(days => {
                  for (const date in days) {

                    const [dt1, dt2] = date.split(' , ');

                    const formattedDate = moment(dt1, 'YYYY/MM/DD').format('MMM D, YYYY'); // more userfriendly format
                    const formattedTime = moment(dt2, 'HH:mm:ss').format('h:mm:ss A'); 
                    
                    const salesValue = days[date];

                    datesValuePairs.push({
                      dateTime: `${formattedDate} ${formattedTime}`, // Combine date and time with separately and togther
                      date:  `${formattedDate}`,
                      time:`${formattedTime}`,
                      sales: salesValue
                    });

                    
                      totalSales += salesValue;
                      salesCount++;
                  
                      if (salesValue < currMinSales) {
                        currMinSales = salesValue;
                      }
  
                      if (salesValue > currMaxSales) {
                        currMaxSales = salesValue;
                      }
                 
                  }
                });
              }
            });
          }
        });

        setData(datesValuePairs);
      
        setAverageSales( (totalSales / salesCount));

        setMinSales(currMinSales);

        setMaxSales(currMaxSales);

      })
      .catch(error => {
        console.error("Error retrieving data", error);
      });
  }, []);

  const CustomToolTip = (o) => {
    if (o.payload && o.payload.length) {
      const { dateTime, sales } = o.payload[0].payload;

      const dt1 = dateTime.slice(0,11);
      const dt2 = dateTime.slice(11);
      return (
        <div className="bg-white border border-gray-300 p-2 rounded-lg shadow-lg text-sm">
          <p className="mt-1 text-blue-800 font-medium"><span className="font-bold">Date: </span>  {dt1}</p>
          <p className="mt-1 text-blue-800 font-medium"><span className="font-bold">Time: </span>  {dt2}</p>

          <p className="mt-1 text-blue-800 font-medium"><span className="font-bold">Value: </span>  {sales} </p>
        </div>
      );
    }
    return null;
  };

  return (
    <main class="px-0 sm:px-0 space-y-6">
    <div class="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between bg-gray-100 p-4">
      <div class="mr-6">
      <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-teal-500 text-5xl font-black5">Parser</h1>
      </div>

        <div class="flex flex-wrap items-start justify-end -mb-3">
            <button class="inline-flex px-5 py-3 text-purple-600 hover:text-purple-700 focus:text-purple-700 hover:bg-purple-100 focus:bg-purple-100 border border-purple-600 rounded-md mb-3">
              <BiEdit fontSize={"1.5em"}/> &nbsp;&nbsp;&nbsp;
              Manage 
            </button>
            <button class="inline-flex px-8 py-3 text-white bg-purple-600 hover:bg-purple-700 focus:bg-purple-700 rounded-md ml-6 mb-3">
              <LuUserCircle fontSize={"1.5em"}/> &nbsp;&nbsp;&nbsp;
              Admin 
            </button>
        </div>
      </div>
      <section class="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div class="flex items-center p-8 bg-white shadow rounded-lg">
          <div class="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
          <TiGroup fontSize={"2em"} /> 
          </div>
          <div>
            <span class="block text-2xl font-bold">100</span>
            <span class="block text-gray-500">Users</span>
          </div>
        </div>
        <div class="flex items-center p-8 bg-white shadow rounded-lg">
          <div class="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
          <LuArrowUpRight fontSize={"2em"} />
          </div>
          <div>
            <span class="block text-2xl font-bold">{averageSales.toFixed(2)}</span>
            <span class="block text-gray-500">Average</span>
          </div>
        </div>
        <div class="flex items-center p-8 bg-white shadow rounded-lg">
          <div class="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
          <LuArrowDownRight fontSize={"2em"} />

          </div>
          <div>
            <span class="inline-block text-2xl font-bold">{minSales}</span>
            <span class="block text-gray-500">Minimum</span>
          </div>
        </div>
        <div class="flex items-center p-8 bg-white shadow rounded-lg">
          <div class="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
          <LuArrowUp10 fontSize={"2em"} />
          </div>
          <div>
            <span class="block text-2xl font-bold">{maxSales}</span>
            <span class="block text-gray-500">Maximum</span>
          </div>
        </div>
      </section>
     
      <section class="grid md:grid-cols xl:grid-cols xl:grid-rows xl:grid-flow-col ">
        <div class="flex flex-col md:col-span-2 md:row-span-2 bg-white shadow rounded-lg">
          <div class="px-6 py-5 font-semibold border-b border-gray-100">The number of sales per month</div>
          <div class="p-4 flex-grow">
            <div class="flex items-center justify-center h-full px-4 py-16 text-gray-400 text-3xl font-semibold bg-gray-100 border-2 border-gray-200 border-dashed rounded-md">
            <ResponsiveContainer width="100%" height={600}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                angle={-45} 
                interval={0}
                textAnchor="end" 
                height={50} 
                style={{
                  fontWeight: '500',
                  }}
        
              />
              <YAxis />
              <Tooltip content={CustomToolTip} />
              <Legend />
              <Bar dataKey="sales" fill="url(#colorUv)" /> 
            </BarChart>
          </ResponsiveContainer>
            </div>
          </div>
        </div>
        </section>
     


    
    </main>
  );
}

export default App;
