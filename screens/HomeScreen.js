import {StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import React, {useEffect, useContext, useState, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import {UserType} from '../UserContext';
import axios from 'axios';
import {AntDesign} from '@expo/vector-icons';
import {FontAwesome} from '@expo/vector-icons';
import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import moment from 'moment';
import {formatDateTime} from '../utils/formatDateTime';

const HomeScreen = () => {
	const {userId, setUserId} = useContext(UserType);
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const fetchUser = async () => {
			const token = await AsyncStorage.getItem('authToken');
			const decodedToken = jwt_decode(token);
			const userId = decodedToken.userId;
			setUserId(userId);
		};

		fetchUser();
	}, []);

	// Fetch when the screen first loads
	useEffect(() => {
		fetchPosts();
	}, []);

	// Fetch when the screen gets to focus again (change of screens)
	useFocusEffect(
		useCallback(() => {
			fetchPosts();
		}, [])
	);

	const fetchPosts = async () => {
		try {
			const response = await axios.get('http://192.168.0.103:3000/get-posts');
			setPosts(response.data);
		} catch (error) {
			console.log('error fetching posts', error);
		}
	};

	const handleLike = async (postId) => {
		try {
			const response = await axios.put(
				`http://192.168.0.103:3000/posts/${postId}/${userId}/like`
			);
			const updatedPost = response.data;

			const updatedPosts = posts?.map((post) =>
				post?._id === updatedPost._id ? updatedPost : post
			);

			setPosts(updatedPosts);
		} catch (error) {
			console.log('Error liking the post', error);
		}
	};

	const handleDislike = async (postId) => {
		try {
			const response = await axios.put(
				`http://192.168.0.103:3000/posts/${postId}/${userId}/unlike`
			);
			const updatedPost = response.data;
			// Update the posts array with the updated post
			const updatedPosts = posts.map((post) =>
				post._id === updatedPost._id ? updatedPost : post
			);
			console.log('updated ', updatedPosts);

			setPosts(updatedPosts);
		} catch (error) {
			console.error('Error unliking post:', error);
		}
	};

	return (
		<SafeAreaView>
			<ScrollView>
				<View style={styles.headerContainer}>
					<Image
						style={styles.headerImage}
						source={{
							uri: 'https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png',
						}}
					/>
				</View>
				<View style={{marginTop: 20}}>
					{posts?.map((post) => (
						<View key={post?._id} style={styles.postContainer}>
							<View>
								<Image
									style={styles.postUserImg}
									source={{
										uri: `https://i.pravatar.cc/48?u=${post?.user?._id}`,
									}}
								/>
							</View>

							<View style={styles.postContent}>
								<Text style={styles.userName}>{post?.user?.name}</Text>
								<Text>{post?.content}</Text>

								<View
									style={{
										flexDirection: 'row',
										alignItems: 'space-between',
										justifyContent: 'center',
									}}
								>
									<View style={styles.icons}>
										{post?.likes?.includes(userId) ? (
											<AntDesign
												onPress={() => handleDislike(post?._id)}
												name='heart'
												size={18}
												color='red'
											/>
										) : (
											<AntDesign
												onPress={() => handleLike(post?._id)}
												name='hearto'
												size={18}
												color='black'
											/>
										)}

										<FontAwesome name='comment-o' size={18} color='black' />

										<Ionicons
											name='share-social-outline'
											size={18}
											color='black'
										/>
									</View>

									<View style={{paddingRight: 5}}>
										<Text style={{color: 'gray'}}>
											{formatDateTime(moment(post?.createdAt))}
										</Text>
									</View>
								</View>
								<Text style={styles.postStats}>
									{post?.likes?.length} likes • {post?.replies?.length} reply
								</Text>
							</View>
						</View>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	headerContainer: {alignItems: 'center', marginTop: 20},
	headerImage: {width: 60, height: 40, resizeMode: 'contain'},
	postContainer: {
		padding: 15,
		borderColor: '#D0D0D0',
		borderTopWidth: 1,
		flexDirection: 'row',
		gap: 10,
		// marginVertical: 10,
	},
	postUserImg: {
		width: 40,
		height: 40,
		borderRadius: 20,
		resizeMode: 'contain',
	},
	postContent: {width: '88%'},
	userName: {fontSize: 15, fontWeight: 'bold', marginBottom: 4},
	icons: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		marginTop: 15,
	},
	postStats: {marginTop: 7, color: 'gray'},
});
