import React, {Component} from 'react';

import Pacman from '../Pacman';
import Ghost from '../Ghost'
import Food from '../Food';
import useSound from 'use-sound';
import eatingSound from '../../sounds/eating-sound.mp3';

import './style.css';

class Board extends Component {

    constructor(props) {
        super(props);
        this.state = {
            boardWidth: this.props.boardWidth,
            boardHeight: this.props.boardHeight,
            eatenByGhost: false,
            won: false,
            isPacmanFocused: true,
            focusOnPacman: false,
            isMobile: false
        }

        this.playEatingSound = new Audio(eatingSound);
        
        this.pacmanRef = React.createRef();

        for (let i = 0 ; i < 4; i++) {
            this['ghost'+ i ] = React.createRef();
        }

        this.ghostRef = React.createRef();

        this.foods = [];
        this.amountOfFood = (
            this.state.boardWidth
            * this.state.boardHeight
        ) / (this.props.foodSize * this.props.foodSize) - 1;
        
        for (let i = 0; i <= this.amountOfFood; i++) {
            this['food' + i] = React.createRef();
        }
    }

    componentDidMount() {
        this.intervalCollision = setInterval(this.lookForEatOrBeEaten, 10);
        this.isMobile();
    }

    componentWillUnmount() {
        clearInterval(this.intervalCollision);
    }

    initSound() { // Use the hook inside a class method 
        this.playEatingSound = new Audio(eatingSound);
    }

    lookForEatOrBeEaten = () => {
        
        const pacmanX = this.pacmanRef.current.state.position.left;
        const pacmanY = this.pacmanRef.current.state.position.top;
        const pacmanSize = this.pacmanRef.current.props.size
    
        const pacmanLastX = pacmanX + pacmanSize / 2;
        const pacmanLastY = pacmanY + pacmanSize / 2;
    
        for (let i = 0; i <= this.amountOfFood; i++) {
            const currentFood = this['food' + i].current;

            if (currentFood) {
                const currentFoodX = currentFood.state.position.left;
                const currentFoodY = currentFood.state.position.top;
                const currentFoodSize = currentFood.props.foodSize;
                const currentFoodLastX = currentFoodX + currentFoodSize / 2;
                const currentFoodLastY = currentFoodY + currentFoodSize / 2;
                if (
                (pacmanX >= currentFoodX && pacmanX <= currentFoodLastX)
                || (pacmanLastX >= currentFoodX && pacmanLastX <= currentFoodLastX)) {
                    if ((pacmanY >= currentFoodY && pacmanY <= currentFoodLastY)
                    || (pacmanLastY >= currentFoodY && pacmanLastY <= currentFoodLastY)) {
                        if (!currentFood.state.hidden) {
                            this.playEatingSound.play();
                            currentFood.ate();
                            this.props.setScore((value) => value + 1);

                            if (this.props.score >= this.amountOfFood) {
                                this.setState({
                                    won: true
                                })
                            clearInterval(this.intervalCollision);
                            }
                        }
                    }
                }
            }
        }
          
        for (let i = 0; i < 4; i++) {
            const currentGhost = this['ghost' + i].current;

            if (currentGhost) {
                const currentGhostX = currentGhost.state.position.left;
                const currentGhostY = currentGhost.state.position.top;
                const currentGhostSize = currentGhost.props.size
          
                const currentGhostLastX = currentGhostX + currentGhostSize / 2;
                const currentGhostLastY = currentGhostY + currentGhostSize / 2;
      
                if (
                    (pacmanX >= currentGhostX && pacmanX <= currentGhostLastX)
                    || (pacmanLastX >= currentGhostX && pacmanLastX <= currentGhostLastX)) {
                        if ((pacmanY >= currentGhostY && pacmanY <= currentGhostLastY)
                            || (pacmanLastY >= currentGhostY && pacmanLastY <= currentGhostLastY)) {
                                if (!this.state.isMobile) {
                                    this.setState({
                                        eatenByGhost: true
                                    })
                                    clearInterval(this.intervalCollision);
                                }
                            }
                    }
            }        
        }

        if (!this.state.won && !this.state.eatenByGhost && !this.state.isMobile)  {
            if (this.pacmanRef.current.state.isFocused) {
                this.setState({
                    isPacmanFocused: true
                })
            } else {
                this.setState({
                    isPacmanFocused: false
                })
            }
        }

    }

    focusOnPacman = () => {
        this.setState({
            focusOnPacman: !this.state.focusOnPacman
        })
    }

    reload = () => {
        window.location.reload();
    }

    isMobile = () => {
        if (!window.matchMedia("(hover)").matches) {
            this.setState({
                isMobile: true
            })
        }
    }

    render () {

        const {foodSize} = this.props;
        let foods = [];
        let currentTop = 0;
        let currentLeft = 1 * foodSize;

        for (let i = 0; i < this.amountOfFood; i++) {
            if (currentLeft >= this.state.boardWidth) {
                currentTop += this.props.foodSize;
                currentLeft = 0;
            }
            if (currentTop >= this.state.boardHeight) {
                break;
            }

            const position = {left: currentLeft, top: currentTop};
            currentLeft += foodSize;
            foods.push(
                <Food key={`food-elem-${i}`} position={position} ref={this['food' + i]}/>
            )
        }

        return (
            <main className="board" style={{height: this.state.boardHeight, width: this.state.boardWidth}}>
                {this.state.won || this.state.eatenByGhost ? 
                    this.state.won ? 
                        <div className={"text"}><p>You won!!!</p><p onClick={this.reload}>Do you want to play again?</p></div> 
                        : <div className={"text"}><p>Game Over</p><p onClick={this.reload}>Do you want to play again?</p></div>
                :
                    <>
                        {this.state.isPacmanFocused ? null : <div className={"pausedBoard"}><p>Paused</p><p onClick={this.focusOnPacman}>Click here to resume</p></div> }
                        {this.state.isMobile ? <div className={"pausedBoard mobileBoard"}><p>Mobile it's out of order.<br/>You need a keyboard to play pacman.</p></div> : null}
                        <Pacman ref={this.pacmanRef} focusOnPacman={this.state.focusOnPacman} boardHeight={this.state.boardHeight} boardWidth={this.state.boardWidth}/>
                        <Ghost ref={this['ghost0']} isPacmanFocused={this.state.isPacmanFocused} color="pink" boardHeight={this.state.boardHeight} boardWidth={this.state.boardWidth}/>
                        <Ghost ref={this['ghost1']} isPacmanFocused={this.state.isPacmanFocused} boardHeight={this.state.boardHeight} boardWidth={this.state.boardWidth}/>
                        <Ghost ref={this['ghost2']} isPacmanFocused={this.state.isPacmanFocused} color="blue" boardHeight={this.state.boardHeight} boardWidth={this.state.boardWidth}/>
                        <Ghost ref={this['ghost3']} isPacmanFocused={this.state.isPacmanFocused} color="orange" boardHeight={this.state.boardHeight} boardWidth={this.state.boardWidth} />
                        <Ghost ref={this['ghost4']} isPacmanFocused={this.state.isPacmanFocused} color="green" boardHeight={this.state.boardHeight} boardWidth={this.state.boardWidth} />
                        <Ghost ref={this['ghost4']} isPacmanFocused={this.state.isPacmanFocused} color="black" boardHeight={this.state.boardHeight} boardWidth={this.state.boardWidth}/>
                        {foods}
                    </>
                }
            </main>
        )
    }
}

Board.defaultProps = {
    foodSize: 50,
}

export default Board;