import React from 'react';

import {View, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';

import {useTheme, useNavigation} from '@react-navigation/native';

import {useAuth} from '../providers/auth';

import {palette} from '../styles/palette';
import {sizing} from '../styles/sizing';
import {login} from '../networking/auth';

import Button from './Button';
import InputLabel from "./InputLabel";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Endereço de e-mail inválido.')
    .required('Preencha este campo.'),
  password: Yup.string().required('Preencha este campo.'),
});

const LoginForm = props => {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const {onApiCallback} = props;
  const {handleSignIn} = useAuth();
  const onLoginSubmit = async (values, {setSubmitting, setFieldError}) => {
    setSubmitting(true);
    try {
      const {token} = await login(values);
      const loggedUser = await handleSignIn(token);
      if ('is_active' in loggedUser && !loggedUser.is_active && onApiCallback) {
        onApiCallback(() => {
          navigation.navigate('Home');
        });
      }
    } catch (err) {
      err = err.message;
      try {
        let {errors} = JSON.parse(err);
        if (errors) {
          Object.keys(errors).forEach(field => {
            const fieldName = field === 'User.Email' ? 'Email' : field;
            setFieldError(fieldName.toLowerCase(), errors[field][0] ?? 'Erro.');
          });
        }
      } catch (e) {
        setFieldError('email', err);
      }
    }
    setSubmitting(false);
  };
  return (
    <Formik
      initialValues={{email: '', password: ''}}
      validationSchema={LoginSchema}
      onSubmit={async (values, {setSubmitting, setFieldError}) => {
        await onLoginSubmit(values, {setSubmitting, setFieldError});
      }}>
      {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
          <View style={styles.formContainer}>
            <InputLabel
                placeholder={'E-mail'}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={errors.email}
                touched={touched.email}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <InputLabel
                placeholder={'Senha'}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                error={errors.password}
                touched={touched.password}
                secureTextEntry={true}
                autoCapitalize="none"
            />
            <Button color={colors.primary} label="Entrar" labelColor={palette.white} labelWeight="bold" labelSize="l" onPress={handleSubmit} style={{marginTop: sizing.l}} />
            <View style={styles.buttonContainer}>
              <Button label="Esqueci minha senha" labelColor={colors.primary} labelWeight="bold" muted onPress={() => navigation.navigate('Forgot')} />
              <Button label="Cadastre-se" labelColor={colors.primary} labelWeight="bold" muted onPress={() => navigation.navigate('RegisterSpecialist')} />
            </View>
          </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: sizing.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

export default LoginForm;
