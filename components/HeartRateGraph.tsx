import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const samplerecords = [
  { time: '2025-03-27T08:00:00Z', beatsPerMinute: 75 }, // 8 AM
  { time: '2025-03-27T09:00:00Z', beatsPerMinute: 80 }, // 9 AM
  { time: '2025-03-27T10:00:00Z', beatsPerMinute: 78 }, // 10 AM
  { time: '2025-03-27T11:00:00Z', beatsPerMinute: 85 }, // 11 AM
  { time: '2025-03-27T12:03:00Z', beatsPerMinute: 82 }, // 12:03 PM
  { time: '2025-03-27T00:00:00Z', beatsPerMinute: 65 }, // 12 AM
  { time: '2025-03-27T07:00:00Z', beatsPerMinute: 70 }, // 7 AM
  { time: '2025-03-27T12:00:00Z', beatsPerMinute: 75 }, // 12 PM
  { time: '2025-03-27T19:00:00Z', beatsPerMinute: 80 }, // 7 PM
];

const xAxisLabels = ['12 AM', '6 AM', '12 PM', '6 PM', '12 AM'];

// Map time to normalized x-position (0 to 24 range)
const mapTimeToX = (time) => {
  const date = new Date(time);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return hours + minutes / 60; // 0 → 24 range
};

// Format chart data with proper x-axis alignment
const formatChartData = (records) => {
  const totalHours = 24; // 24-hour range
  const dataPoints = new Array(totalHours * 4).fill(null); // Higher resolution

  records.forEach((record) => {
    const xPos = mapTimeToX(record.time);
    const index = Math.floor((xPos / totalHours) * dataPoints.length); // Scaled index
    dataPoints[index] = record.beatsPerMinute;
  });

  return {
    labels: xAxisLabels, // X-axis labels
    datasets: [
      {
        data: dataPoints.map((value) => value ?? null), // Fill null gaps
        strokeWidth: 2,
      },
    ],
  };
};

const HeartRateGraph = () => {
  return (
    <View>
      {samplerecords.length > 0 ? (
        <LineChart
          data={formatChartData(samplerecords)}
          width={Dimensions.get('window').width - 40}
          height={280}
          yAxisLabel=""
          yAxisSuffix=" BPM"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 0) => `rgba(34, 139, 230, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: {
              r: '4',
            },
          }}
          bezier
          style={{ marginLeft: -11, marginTop: 10 }}
        />
      ) : (
        <Text>No data available</Text>
      )}
    </View>
  );
};

export default HeartRateGraph;
