import {
	Alert,
	Image,
	KeyboardAvoidingView,
	Pressable,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import {useEffect, useState} from 'react';
import {MaterialIcons, AntDesign, Feather} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [textHidden, setTextHidden] = useState(true);
	const navigation = useNavigation();

	useEffect(function () {
		const checkLoginStatus = async () => {
			try {
				const token = await AsyncStorage.getItem('authToken');

				if (token) {
					setTimeout(() => {
						navigation.replace('Main');
					}, 400);
				}
			} catch (error) {
				console.log('error', error);
			}
		};

		checkLoginStatus();
	}, []);

	function handleLogin() {
		const user = {
			email: email,
			password: password,
		};

		console.log(user);
		axios
			.post('http://192.168.0.104:3000/login', user)
			.then((res) => {
				console.log(res);
				const token = res.data.token;

				// Storing the token in AsyncStorage just like localStorage
				AsyncStorage.setItem('authToken', token);
				navigation.navigate('Main', {screen: 'HomeScreen'});
			})
			.catch((error) => {
				console.log('Error logging in: ', error);
				Alert.alert('Error logging in.');
			});
	}

	function toggleEye() {
		setTextHidden((textHidden) => !textHidden);
	}

	return (
		<SafeAreaView style={styles.root}>
			<View style={{marginTop: 70}}>
				<Image
					style={styles.logoImg}
					source={{
						uri: 'https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png',
					}}
				/>
			</View>

			<KeyboardAvoidingView>
				<View style={styles.heading}>
					<Text style={styles.headingText}>Login to Your Account</Text>
				</View>

				<View style={{marginTop: 40}}>
					<View style={styles.inputContainer}>
						<MaterialIcons
							style={{marginLeft: 8}}
							name='email'
							size={24}
							color='gray'
						/>
						<TextInput
							value={email}
							onChangeText={(text) => setEmail(text)}
							style={styles.inputText}
							placeholder='enter your email'
						/>
					</View>
				</View>

				<View style={{marginTop: 40}}>
					<View style={styles.inputContainer}>
						<AntDesign
							style={{marginLeft: 8}}
							name='lock'
							size={24}
							color='gray'
						/>
						<TextInput
							secureTextEntry={textHidden ? true : false}
							value={password}
							onChangeText={(text) => setPassword(text)}
							style={styles.inputText}
							placeholder='enter your Password'
						/>
						<Pressable onPress={toggleEye}>
							{textHidden ? (
								<Feather name='eye' size={24} color='gray' />
							) : (
								<Feather name='eye-off' size={24} color='gray' />
							)}
						</Pressable>
					</View>
				</View>

				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						marginTop: 20,
					}}
				>
					<Text>Keep me logged in</Text>
					<Text style={{fontWeight: 500, color: '#007fff'}}>
						Forgot Password
					</Text>
				</View>

				<View style={{marginTop: 45}} />

				<Pressable onPress={handleLogin} style={styles.loginBtn}>
					<Text style={styles.loginText}>Login</Text>
				</Pressable>

				<Pressable
					onPress={() => navigation.navigate('RegisterScreen')}
					style={{marginTop: 10}}
				>
					<Text style={{textAlign: 'center', fontSize: 16}}>
						Don't have an account? Sign up
					</Text>
				</Pressable>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
	root: {flex: 1, backgroundColor: 'white', alignItems: 'center'},
	logoImg: {width: 130, height: 130, resizeMode: 'contain'},
	heading: {alignItems: 'center', justifyContent: 'center'},
	headingText: {fontSize: 17, fontWeight: 'bold', marginTop: 25},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		width: 320,
		gap: 5,
		borderColor: 'gray',
		borderWidth: 1,
		borderRadius: 5,
	},
	inputText: {
		color: 'gray',
		marginVertical: 10,
		width: 240,
		fontSize: 16,
	},
	loginBtn: {
		width: 200,
		backgroundColor: 'black',
		padding: 15,
		marginTop: 40,
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 6,
	},
	loginText: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 16,
		color: 'white',
	},
});
