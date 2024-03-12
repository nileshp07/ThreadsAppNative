import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Entypo, AntDesign, Ionicons} from '@expo/vector-icons';
import ThreadsScreen from './screens/ThreadsScreen';
import ActivityScreen from './screens/ActivityScreen';
import ProfileScreen from './screens/ProfileScreen';

const StackNavigator = () => {
	const Stack = createNativeStackNavigator();
	const Tab = createBottomTabNavigator();

	function BottomTabs() {
		return (
			<Tab.Navigator>
				<Tab.Screen
					name='HomeScreen'
					component={HomeScreen}
					options={{
						tabBarLabel: 'Home',
						tabBarLabelStyle: {color: 'black', fontSize: 12, marginBottom: 4},
						headerShown: false,
						tabBarIcon: ({focused}) =>
							focused ? (
								<Entypo name='home' size={24} color='black' />
							) : (
								<AntDesign name='home' size={24} color='black' />
							),
					}}
				/>
				<Tab.Screen
					name='ThreadsScreen'
					component={ThreadsScreen}
					options={{
						tabBarLabel: 'Create',
						tabBarLabelStyle: {color: 'black', fontSize: 12, marginBottom: 4},
						headerShown: false,
						tabBarIcon: ({focused}) =>
							focused ? (
								<Ionicons name='create' size={24} color='black' />
							) : (
								<Ionicons name='create-outline' size={24} color='black' />
							),
					}}
				/>
				<Tab.Screen
					name='ActivityScreen'
					component={ActivityScreen}
					options={{
						tabBarLabel: 'Activity',
						tabBarLabelStyle: {color: 'black', fontSize: 12, marginBottom: 4},
						headerShown: false,
						tabBarIcon: ({focused}) =>
							focused ? (
								<AntDesign name='heart' size={24} color='black' />
							) : (
								<AntDesign name='hearto' size={24} color='black' />
							),
					}}
				/>
				<Tab.Screen
					name='ProfileScreen'
					component={ProfileScreen}
					options={{
						tabBarLabel: 'Profile',
						tabBarLabelStyle: {color: 'black', fontSize: 12, marginBottom: 4},
						headerShown: false,
						tabBarIcon: ({focused}) =>
							focused ? (
								<Ionicons name='person' size={24} color='black' />
							) : (
								<Ionicons name='person-outline' size={24} color='black' />
							),
					}}
				/>
			</Tab.Navigator>
		);
	}

	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name='LoginScreen'
					component={LoginScreen}
					options={{headerShown: false}}
				/>
				<Stack.Screen
					name='RegisterScreen'
					component={RegisterScreen}
					options={{headerShown: false}}
				/>
				<Stack.Screen
					name='Main'
					component={BottomTabs}
					options={{headerShown: false}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default StackNavigator;

const styles = StyleSheet.create({});
