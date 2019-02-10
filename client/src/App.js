import React, { Component } from "react";
import "./App.css";

import AuthService from "./components/AuthService";
import withAuth from "./components/withAuth";

const Auth = new AuthService();

class App extends Component {
    state = {
        curNum: "0"
    };

    handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch("/api/count", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ curNum: this.state.curNum })
        });

        let nextNum = await response.text();
        if (
            window.confirm(
                `Current count: ${this.state.curNum}. Next count: ${nextNum}.`
            )
        ) {
            this.setState({ curNum: nextNum });
        }
    };

    render() {
        return (
            <div>
                <div className="header-container">
                    {/* 
                    <h2 className="header-text">
                        Welcome {this.props.user.username}
                    </h2>
                    */}
                    <button
                        type="button"
                        onClick={this.handleLogout.bind(this)}
                    >
                        Logout
                    </button>
                </div>

                <div className="counter-container">
                    <div className="counter-item">
                        <span>Count: {this.state.curNum}</span>
                        <form onSubmit={this.handleSubmit}>
                            <button type="submit">Increment</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    handleLogout() {
        Auth.logout();
        this.props.history.replace("/login");
    }
}

export default withAuth(App);
