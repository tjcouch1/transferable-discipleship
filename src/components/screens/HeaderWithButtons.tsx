import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Header, HeaderData } from '../Header';
import { ScreenDataBase } from './Screens';
import { getScreen } from '../../services/ScreenService';
import { ButtonList, ButtonListData } from '../ButtonList';

export type HeaderWithButtonsProps = {
    type: 'HeaderWithButtons';
    headerData: HeaderData;
    buttonListData: ButtonListData;
} & ScreenDataBase;

export const HeaderWithButtons = ({
    navigation,
    route,
}: NativeStackScreenProps<any>) => {
    const { headerData, buttonListData } = getScreen(route.name);

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View style={styles.layout}>
                <Header {...headerData} />
                <ButtonList {...buttonListData} navigation={navigation} />
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
});
