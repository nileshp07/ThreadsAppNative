import {StyleSheet, Text, View, Image, Pressable} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import {UserType} from '../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FontAwesome6} from '@expo/vector-icons';

const ProfileScreen = () => {
	const [user, setUser] = useState('');
	const navigation = useNavigation();
	const {userId, setUserId} = useContext(UserType);
	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await axios.get(
					`http://192.168.0.103:3000/profile/${userId}`
				);
				const {user} = response.data;
				setUser(user);
			} catch (error) {
				console.log('error', error);
			}
		};

		fetchProfile();
	});

	const logout = () => {
		clearAuthToken();
	};

	const clearAuthToken = async () => {
		await AsyncStorage.removeItem('authToken');
		console.log('Cleared auth token');
		navigation.replace('LoginScreen');
	};

	return (
		<SafeAreaView>
			<View style={{marginTop: 30, padding: 15}}>
				<View>
					<View style={{flexDirection: 'row', alignItems: 'center'}}>
						<View style={{flexDirection: 'row', gap: 10, flex: 32}}>
							<Text style={{fontSize: 20, fontWeight: 'bold'}}>
								{user?.name}
							</Text>
							<View
								style={{
									paddingHorizontal: 7,
									paddingVertical: 5,
									borderRadius: 8,
									backgroundColor: '#D0D0D0',
								}}
							>
								<Text>Threads.net</Text>
							</View>
						</View>
						<View style={{flex: 3}}>
							<FontAwesome6 name='bars' size={24} color='black' />
						</View>
					</View>

					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							gap: 20,
							marginTop: 15,
						}}
					>
						<View>
							<Image
								style={{
									width: 60,
									height: 60,
									borderRadius: 30,
									resizeMode: 'contain',
								}}
								source={{
									uri: `https://i.pravatar.cc/48?u=${userId}`,
								}}
							/>
						</View>

						<View>
							<Text style={{fontSize: 15, fontWeight: '400'}}>BTech.</Text>
							<Text style={{fontSize: 15, fontWeight: '400'}}>
								Movie Buff | Musical Nerd
							</Text>
							<Text style={{fontSize: 15, fontWeight: '400'}}>
								Love Yourself
							</Text>
						</View>
					</View>
					<Text style={{color: 'gray', fontSize: 15, marginTop: 10}}>
						{user?.followers?.length} followers
					</Text>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							gap: 10,
							marginTop: 20,
						}}
					>
						<Pressable
							style={{
								flex: 1,
								justifyContent: 'center',
								alignItems: 'center',
								padding: 10,
								borderColor: '#D0D0D0',
								borderWidth: 1,
								borderRadius: 5,
							}}
						>
							<Text>Edit Profile</Text>
						</Pressable>

						<Pressable
							onPress={logout}
							style={{
								flex: 1,
								justifyContent: 'center',
								alignItems: 'center',
								padding: 10,
								borderColor: '#D0D0D0',
								borderWidth: 1,
								borderRadius: 5,
							}}
						>
							<Text>Logout</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default ProfileScreen;

const styles = StyleSheet.create({});
