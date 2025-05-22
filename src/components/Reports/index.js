import React, { useContext } from 'react'; // Import useContext
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './index.css';
import Header from '../Header';
import MoodTrackerContext from '../../context/MoodTrackerContext';

const Reports = () => { // Converted to functional component
  const contextValue = useContext(MoodTrackerContext); // Use useContext
  const {
    initialMonthsList, // Used for month names in the dropdown
    emojisListNew, // This is emojisListWithCounts, aliased in App.js context
    onReportCalenderChange, // This is handleReportMonthChange, aliased in App.js context
    calenderReportList, // This is monthlyReportData, aliased in App.js context
    reportCalenderMonth, // This is reportMonth, aliased in App.js context
  } = contextValue;

  // Ensure emojisListNew and calenderReportList are available
  const displayEmojis = emojisListNew || [];
  const reportData = calenderReportList || [];
  const monthOptions = initialMonthsList || [];


  return (
    <>
      <Header />
      <div
        data-testid="reportsBodyContainer"
        className="reports-body-container"
      >
        <h1
          data-testid="emojiReportHeading"
          className="emoji-report-heading"
        >
          Overall Emojis Reports
        </h1>
        <ul data-testid="emojiReportUl" className="emoji-report-ul">
          {displayEmojis.map(item => (
            <li
              data-testid="emojiReportLi"
              className="emoji-report-li"
              key={item.id}
            >
              <p data-testid="emojiLiPara" className="emoji-li-para">
                {item.emojiName}
              </p>
              <img
                data-testid="emojiLiImg"
                className="emoji-li-img"
                src={item.emojiUrl}
                alt={item.emojiName}
              />
              <p data-testid="emojiCount" className="emoji-count">
                {item.count}
              </p>
            </li>
          ))}
        </ul>
        <div data-testid="monthlyContainer" className="monthly-container">
          <h1
            data-testid="monthlyReportsHeading"
            className="monthly-reports-heading"
          >
            Monthly Reports
          </h1>
          <select
            value={reportCalenderMonth}
            onChange={onReportCalenderChange}
            className="calender-select"
            data-testid="calenderSelect"
          >
            {/* Use initialMonthsList from context for month options */}
            {monthOptions.map(item => (
              <option key={item.month} value={item.month}>
                {item.monthName}
              </option>
            ))}
          </select>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            className="bar-chart"
            data={reportData} // Use reportData which defaults to empty array
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="emojiName" type="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" barSize={30}>
              {/* The custom label rendering inside <Bar> seems incorrect for Recharts.
                  Labels are typically configured via <LabelList> or properties on <Bar>.
                  Removing this custom map as it's not standard and might cause issues.
                  If labels are needed on bars, <LabelList dataKey="emojiName" /> or similar
                  should be used inside <Bar />. For simplicity, removing it now.
              */}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default Reports;
