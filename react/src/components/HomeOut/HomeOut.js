import React, { Component } from 'react'
import './HomeOut.scss'

export default class HomeOut extends Component {
  render () {
    return (
      <div className="homeOut">
        <h2>Just like othello, but with a dash of &apos;Z&apos;</h2>
        <table>
          <tbody>
            <tr>
              <th scope="col">
                <img src={'./assets/img/duck-red.png'}/>
              </th>
              <th scope="col">
                <img src={'./assets/img/duck-yellow.png'}/>
              </th>
            </tr>
            <tr>
              <th scope="col">
                <img src={'./assets/img/duck-yellow.png'}/>
              </th>
              <th scope="col">
                <img src={'./assets/img/duck-red.png'}/>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
