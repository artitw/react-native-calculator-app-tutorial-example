import React, { Component } from 'react';
import {
    View,
    Text,
    AppRegistry
} from 'react-native';

import Style from './Style';
import InputButton from './InputButton';

// Define the input buttons that will be displayed in the calculator.
const inputButtons = [
    [1, 2, 3, '/'],
    [4, 5, 6, '*'],
    [7, 8, 9, '-'],
    [0, '.', '=', '+'],
    ['c', 'ce']
];

class Calculator extends Component {

    constructor(props) {
        super(props); //props is received in this component from the parent

        this.initialState = {
            previousValue: 0,
            currentValue: '',
            selectedSymbol: null,
            startOver: true
        }

        //state is how we keep track of (state) changes internally within a component
        this.state = this.initialState

    }

    render() {
        return (
            <View style={Style.rootContainer}>
                <View style={Style.displayContainer}>
                    <Text style={Style.displayText}>{this.state.currentValue}</Text>
                </View>
                <View style={Style.inputContainer}>
                    {this._renderInputButtons()}
                </View>
            </View>
        );
    }

    _renderInputButtons() {

        let views = inputButtons.map((row, idx) => {
            let inputRow = row.map((buttonVal, columnIdx) => {
                return <InputButton
                            value={buttonVal}
                            highlight={this.state.selectedSymbol === buttonVal}
                            onPress={this._onInputButtonPressed.bind(this, buttonVal)}
                            key={'butt-' + columnIdx} />;
            });

            return <View style={Style.inputRow} key={'row-' + idx}>{inputRow}</View>;
        });

        return views;
    }

    _onInputButtonPressed(input) {
        switch (typeof input) {
            case 'number':
                return this._handleNumberInput(input);
            default:
                return this._handleStringInput(input);
        }
    }

    _handleNumberInput(num) {
        if (this.state.startOver) {
            this.setState({
                currentValue: ''+num,
                startOver: false
            })
        } else {
            this.setState({
                currentValue: this.state.currentValue+''+num
            });
        }
    }

    _handleStringInput(str) {
        switch (str) {
            case '.':
                if (!this.state.startOver && this.state.currentValue.indexOf('.') > -1) break
                
                if (this.state.startOver) {
                    this.setState({
                        currentValue: ''+str,
                        startOver: false
                    })
                } else {
                    this.setState({
                        currentValue: this.state.currentValue+''+str
                    });
                }
                
                break;

            case '/':
            case '*':
            case '+':
            case '-':
                this.setState({
                    selectedSymbol: str,
                    previousValue: this.state.currentValue,
                    startOver: true
                });
                break;

            case '=':
                let symbol = this.state.selectedSymbol,
                    currentValue = this.state.currentValue,
                    previousValue = this.state.previousValue;

                if (!symbol) {
                    return;
                }

                this.setState({
                    previousValue: 0,
                    currentValue: ''+eval(previousValue + symbol + currentValue),
                    selectedSymbol: null,
                    startOver: true
                });
                break;

            case 'ce':
                this.setState(this.initialState);
                break;

            case 'c':
                this.setState({currentValue: ''});
                break;

        }
    }

}

AppRegistry.registerComponent('Calculator', () => Calculator);
