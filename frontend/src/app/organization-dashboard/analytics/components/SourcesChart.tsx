'use client';

import * as React from 'react';
import { SourceDataPoint } from './types';

interface SourcesChartProps {
  data: SourceDataPoint[];
}

export default function SourcesChart({ data }: SourcesChartProps) {
  const [canvasElement, setCanvasElement] = React.useState<HTMLCanvasElement | null>(null);
  const [chartInstance, setChartInstance] = React.useState<any>(null);

  React.useEffect(() => {
    if (!canvasElement) return;
    
    const loadChart = async () => {
      try {
        // Dynamically import Chart.js to avoid server-side rendering issues
        const { Chart, registerables } = await import('chart.js');
        Chart.register(...registerables);
        
        // Format data for chart
        const labels = data.map(item => item.source);
        const values = data.map(item => item.count);
        
        // Define a vibrant color palette for the pie chart
        const backgroundColors = [
          'rgba(59, 130, 246, 0.8)', // Blue
          'rgba(16, 185, 129, 0.8)', // Green
          'rgba(245, 158, 11, 0.8)', // Amber
          'rgba(236, 72, 153, 0.8)', // Pink
          'rgba(124, 58, 237, 0.8)', // Purple
          'rgba(75, 85, 99, 0.8)'    // Gray
        ];
        
        // Clear existing chart if it exists
        if (chartInstance) {
          chartInstance.destroy();
        }
        
        // Create new chart
        const ctx = canvasElement.getContext('2d');
        if (!ctx) return;
        
        const newChartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels,
            datasets: [
              {
                data: values,
                backgroundColor: backgroundColors,
                borderColor: 'white',
                borderWidth: 2,
                hoverOffset: 10
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  font: {
                    size: 12
                  },
                  padding: 20
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw as number;
                    const percentage = data[context.dataIndex].percentage;
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            },
            cutout: '65%',
            animation: {
              animateScale: true,
              animateRotate: true
            }
          }
        });
        
        setChartInstance(newChartInstance);
      } catch (error) {
        console.error('Error loading chart:', error);
      }
    };
    
    loadChart();
    
    // Cleanup
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [data, canvasElement, chartInstance]);

  return (
    <div className="w-full h-60">
      <canvas ref={setCanvasElement}></canvas>
    </div>
  );
}
