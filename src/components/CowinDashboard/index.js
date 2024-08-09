// import {Component} from 'react'
// import Loader from 'react-loader-spinner'

// import VaccinationCoverage from '../VaccinationCoverage'

// import VaccinationByGender from '../VaccinationByGender'
// import VaccinationByAge from '../VaccinationByAge'

// import './index.css'

// const componentsValues = {
//   pending: 'PENDING',
//   success: 'SUCCESS',
//   failure: 'FAILURE',
//   initialy: 'INITIALY',
// }

// class CowinDashboard extends Component {
//   state = {
//     fetchedData: {},
//     displayStatus: componentsValues.initialy,
//   }

//   componentDidMount() {
//     this.fetchedDataApi()
//   }

//   fetchedDataApi = async () => {
//     this.setState({displayStatus: componentsValues.pending})
//     const vaccinationDataApiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
//     const response = await fetch(vaccinationDataApiUrl)
//     const data = await response.json()
//     if (response.ok === true) {
//       const convertData = {
//         last7DaysVaccination: data.last_7_days_vaccination,
//         vaccinationByAge: data.vaccination_by_age,
//         vaccinationByGender: data.vaccination_by_gender,
//       }

//       this.setState({
//         fetchedData: convertData,
//         displayStatus: componentsValues.success,
//       })
//     } else {
//       this.setState({displayStatus: componentsValues.failure})
//     }
//   }

//   renderPycharts = () => {
//     const {fetchedData} = this.state
//     const {
//       last7DaysVaccination,
//       vaccinationByGender,
//       vaccinationByAge,
//     } = fetchedData
//     return (
//       <>
//         <VaccinationCoverage VaccinationData={last7DaysVaccination} />
//         <VaccinationByGender vaccinationByGenderData={vaccinationByGender} />
//         <VaccinationByAge vaccinationByAgeDetails={vaccinationByAge} />
//       </>
//     )
//   }

//   loadingView = () => (
//     <div data-testid="loader">
//       <Loader type="ThreeDots" color="#ffff" height={80} width={80} />
//     </div>
//   )

//   failureView = () => (
//     <div className="failure-view-container">
//       <img
//         className="failure-view-img"
//         src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
//         alt="failure view"
//       />
//       <h1 className="failure-view-text">Something went wrong</h1>
//     </div>
//   )

//   switchcaseCheck = () => {
//     const {displayStatus} = this.state
//     switch (displayStatus) {
//       case componentsValues.success:
//         return this.renderPycharts()
//       case componentsValues.pending:
//         return this.loadingView()
//       case componentsValues.failure:
//         return this.failureView()
//       default:
//         return null
//     }
//   }

//   render() {
//     return (
//       <div className="page-container">
//         <div className="page-logo-container">
//           <img
//             className="logo"
//             src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
//             alt="website logo"
//           />
//           <p className="Logo-text">Co-WIN</p>
//         </div>
//         <h1 className="page-heading">CoWIN Vaccination in India</h1>
//         <div className="chats-container">{this.switchcaseCheck()}</div>
//       </div>
//     )
//   }
// }

// export default CowinDashboard
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    vaccinationData: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const covidVaccinationDataApiUrl =
      'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(covidVaccinationDataApiUrl)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = {
        last7DaysVaccination: fetchedData.last_7_days_vaccination.map(
          eachDayData => ({
            vaccineDate: eachDayData.vaccine_date,
            dose1: eachDayData.dose_1,
            dose2: eachDayData.dose_2,
          }),
        ),
        vaccinationByAge: fetchedData.vaccination_by_age.map(range => ({
          age: range.age,
          count: range.count,
        })),
        vaccinationByGender: fetchedData.vaccination_by_gender.map(
          genderType => ({
            gender: genderType.gender,
            count: genderType.count,
          }),
        ),
      }
      this.setState({
        vaccinationData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderVaccinationStats = () => {
    const {vaccinationData} = this.state

    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageDetails={vaccinationData.last7DaysVaccination}
        />
        <VaccinationByGender
          vaccinationByGenderDetails={vaccinationData.vaccinationByGender}
        />
        <VaccinationByAge
          vaccinationByAgeDetails={vaccinationData.vaccinationByAge}
        />
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  renderLoadingView = () => (
    <div className="loading-view" data-testid="loader">
      <Loader color="#ffffff" height={80} type="ThreeDots" width={80} />
    </div>
  )

  renderViewsBasedOnAPIStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderVaccinationStats()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="cowin-dashboard-container">
          <div className="logo-container">
            <img
              className="logo"
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
            />
            <h1 className="logo-heading">Co-WIN</h1>
          </div>
          <h1 className="heading">CoWIN Vaccination in India</h1>
          {this.renderViewsBasedOnAPIStatus()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
