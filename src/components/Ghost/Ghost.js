import React, {Component} from 'react';

import { ReactComponent as GhostSvg} from "./ghost.svg";

import './style.css';

class Ghost extends Component {

    state = {
        direction: "left",
        position: {
            top: 50 * Math.floor((this.props.boardHeight/50)/2),
            left: 50 * Math.floor((this.props.boardWidth/50)/2),
        },
        boardWidth: this.props.boardWidth,
        boardHeight: this.props.boardHeight
    }

    componentDidMount() {
            this.changeDirectionInterval = setInterval(this.changeDirection, 500);
            this.moveInterval = setInterval(this.move, 500);
    }

    componentWillUnmount() {
        clearInterval(this.changeDirectionInterval);
        clearInterval(this.moveInterval);
    }

    changeDirection = () => {
        const arrayOfMovement = ["left", "right", "up", "down"];
        const movement = arrayOfMovement[Math.floor(Math.random() * 4)];

        this.setState ({
            direction: movement
        })
    }

    move = () => {

        const currentTop = this.state.position.top;
        const currentLeft = this.state.position.left;
        const {direction} = this.state;
        const {step, size} = this.props;

        if (this.props.isPacmanFocused) {
            if (direction === "up") {
                this.setState({
                    position: {
                        top: Math.max(currentTop - step, 0),
                        left: currentLeft
                    }
                })
            } else if (direction === "right") {
                this.setState({
                    position: {
                        top: currentTop,
                        left: Math.min(currentLeft + step, this.state.boardWidth - size)
                    }
                })
            } else if (direction === "down") {
                this.setState({
                    position: {
                        top: Math.min(currentTop + step, this.state.boardHeight - size),
                        left: currentLeft
                    }
                })
            } else if (direction === "left") {
                this.setState({
                    position: {
                        top: currentTop,
                        left: Math.max(currentLeft - step,0)
                    }
                })
            }
        }
    }

    render() {
        const {color} = this.props;
        return (
            <div style={this.state.position} className="ghost">
                <GhostSvg className={`ghost-${color}`} />
            </div>
        )
    }
}

Ghost.defaultProps = {
    color: "red",
    step: 50,
    size: 50,
}

export default Ghost;