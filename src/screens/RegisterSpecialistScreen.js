import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import RegisterForm from '../components/RegisterForm';
import {sizing} from '../styles/sizing';

const RegisterSpecialistScreen = () => (
    <ScreenWrapper scroll>
        <View style={{flex: 1, padding:sizing.l}}>
            <Image
              style={styles.logoImage}
              source={require('../assets/images/logo.png')}
            />
            <RegisterForm type="specialist" />
        </View>
    </ScreenWrapper>
);

const styles = StyleSheet.create({
    logoImage: {
        height: 84,
        marginVertical: sizing.xxl,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
});

export default RegisterSpecialistScreen;