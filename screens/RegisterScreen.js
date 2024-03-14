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
import {useContext, useState} from 'react';
import {MaterialIcons, AntDesign, Feather, Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const RegisterScreen = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [textHidden, setTextHidden] = useState(true);

	const navigation = useNavigation();

	async function handleRegister() {
		const inputData = {
			name,
			email,
			password,
		};

		axios
			.post('http://192.168.0.101:3000/register', inputData)
			.then((res) => {
				console.log(res);
				Alert.alert(res.data.message);
				setName('');
				setEmail('');
				setPassword('');
				navigation.navigate('Main', {screen: 'HomeScreen'});
			})
			.catch((err) => {
				console.log('Error Registering.', err);
				Alert.alert(
					'Registration failed.',
					'an error occured during registration.'
				);
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
					<Text style={styles.headingText}>Register to Your Account</Text>
				</View>

				<View style={{marginTop: 40}}>
					<View style={styles.inputContainer}>
						<Ionicons
							style={{marginLeft: 8}}
							name='person'
							size={24}
							color='gray'
						/>
						<TextInput
							value={name}
							onChangeText={(text) => setName(text)}
							style={styles.inputText}
							placeholder='enter your Name'
						/>
					</View>
				</View>

				<View style={{marginTop: 30}}>
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

				<View style={{marginTop: 30}}>
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

				<View style={{marginTop: 45}} />

				<Pressable onPress={handleRegister} style={styles.registerBtn}>
					<Text style={styles.registerText}>Register</Text>
				</Pressable>

				<Pressable onPress={() => navigation.goBack()} style={{marginTop: 10}}>
					<Text style={{textAlign: 'center', fontSize: 16}}>
						Already have an account? Sign in
					</Text>
				</Pressable>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default RegisterScreen;

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
	registerBtn: {
		width: 200,
		backgroundColor: 'black',
		padding: 15,
		marginTop: 40,
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 6,
	},
	registerText: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 16,
		color: 'white',
	},
});
