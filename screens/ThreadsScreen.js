import {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	Button,
	Pressable,
	Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useContext, useState} from 'react';
import axios from 'axios';
import {UserType} from '../UserContext';
import {useNavigation} from '@react-navigation/native';

const MAX_WORDS = 5; // Set the maximum word limit

const ThreadsScreen = () => {
	const [content, setContent] = useState('');
	const {userId, setUserId} = useContext(UserType);
	const [wordCount, setWordCount] = useState(0);
	const navigation = useNavigation();

	const handlePostSubmit = () => {
		const postData = {
			userId,
		};

		// Perform word count validation and trim content if necessary
		const trimmedContent = content.trim(); // Trim leading/trailing spaces

		if (!trimmedContent) {
			Alert.alert('No Content.', 'Please type something before posting.');
			setWordCount(0);
			return;
		}

		postData.content = trimmedContent;

		if (wordCount > MAX_WORDS) {
			Alert.alert(
				'Word Limit Exceeded',
				`Your post exceeds the maximum of ${MAX_WORDS} words. Please shorten it and try again.`
			);

			return; // Prevent further updates if exceeding limit
		}

		axios
			.post('http://192.168.0.101:3000/create-post', postData)
			.then((response) => {
				setContent('');
				setWordCount(0);

				navigation.navigate('HomeScreen');
			})
			.catch((error) => {
				console.log('error creating post', error);
			});
	};

	const handleContentChange = (text) => {
		// Prevent exceeding the word limit
		const trimmedText = text.trim(); // Trim leading/trailing spaces
		numWords = trimmedText.split(/\s+/).length; // Split on spaces for word count
		setWordCount(numWords);

		// If want to prevent from typing when limit reached
		// if (wordCount > MAX_WORDS) {
		// 	Alert.alert(
		// 		'Word Limit Exceeded',
		// 		`Your post exceeds the maximum of ${MAX_WORDS} words. Please shorten it and try again.`
		// 	);
		// 	// setWordCount(MAX_WORDS);
		// 	// return; // Prevent further updates if exceeding limit
		// }

		setContent(text);
	};

	return (
		<SafeAreaView>
			<View style={{marginTop: 35}}>
				<Text style={styles.heading}>Create New Post</Text>
			</View>

			<View style={styles.inputBox}>
				<TextInput
					style={styles.inputText}
					value={content}
					onChangeText={handleContentChange}
					placeholderTextColor={'black'}
					placeholder='Type your message...'
					multiline={true}
					numberOfLines={5}
				/>
			</View>
			<View style={{marginTop: 10}}>
				<Text
					style={[
						styles.wordLimitText,
						{color: wordCount > MAX_WORDS - 2 ? 'red' : 'black'},
					]}
				>
					{wordCount}/{MAX_WORDS} words remaining
				</Text>
			</View>

			<View
				style={{
					marginTop: 20,
				}}
			>
				<Pressable onPress={handlePostSubmit} style={styles.postBtn}>
					<Text style={styles.postBtnText}>Post</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
};

export default ThreadsScreen;

const styles = StyleSheet.create({
	heading: {
		fontSize: 30,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 15,
	},
	inputBox: {
		flexDirection: 'row',
		marginHorizontal: 15,
		borderWidth: 2,
		borderColor: '#D0D0D0',
		borderRadius: 4,
		padding: 4,
	},
	inputText: {
		textAlignVertical: 'top',
		fontSize: 16,
	},
	wordLimitText: {
		textAlign: 'center',
	},
	postBtn: {
		backgroundColor: 'black',
		borderRadius: 3,
		borderWidth: 2,
		padding: 7,
		width: 120,
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	postBtnText: {
		textAlign: 'center',
		color: 'white',
		letterSpacing: 1,
	},
});
