import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {TdButton} from './TdButton';
import {Title} from './Title';

export const Home = () => {
    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View style={styles.layout}>
                <Title />
                <TdButton
                    style={[styles.button]}
                    onPress={() => {}}
                    title="Basics"
                />
                <TdButton
                    style={styles.button}
                    onPress={() => {}}
                    title="Essentials"
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    layout: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    button: {
        marginTop: 45,
    },
});
