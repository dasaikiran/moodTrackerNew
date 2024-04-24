import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import './index.css'
import Header from '../Header'
import MoodTrackerContext from '../../context/MoodTrackerContext'

const Reports = () => (
  <MoodTrackerContext.Consumer>
    {value => {
      const {
        calenderList,
        emojisListNew,
        onReportCalenderChange,
        calenderReportList,
        reportCalenderMonth,
      } = value

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
              {emojisListNew.map(item => (
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
                  {console.log(item)}
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
                {calenderList.map(item => (
                  <option key={item.month} value={item.month}>
                    {item.monthName}
                  </option>
                ))}
              </select>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                className="bar-chart"
                data={calenderReportList}
                margin={{top: 20, right: 30, left: 20, bottom: 5}}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="emojiName" type="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" barSize={30}>
                  {calenderReportList.map(entry => (
                    <text
                      key={`emoji-${entry.id}`}
                      x="20"
                      y={(calenderReportList.indexOf(entry) + 1) * 30}
                      dy={-10}
                      textAnchor="end"
                      fill="#8884d8"
                    >
                      {entry.emojiName}
                    </text>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )
    }}
  </MoodTrackerContext.Consumer>
)

export default Reports
