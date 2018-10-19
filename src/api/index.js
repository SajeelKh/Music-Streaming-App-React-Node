import {v4} from 'node-uuid';

const data = {
	songs: [
		{
			id:v4(),
			title: "All I Want",
			artist: "Kodaline",
			album: "In a Perfect World",
			genre: "Rock",
			duration: new Date('01 Jan 1970 00:00:31 GMT'),
		},
		{
			id:v4(),
			title: "7 years",
			artist: "Luke Graham",
			album: "Lukas Graham (2015 album)",
			genre: "Pop",
			duration: new Date('01 Jan 1970 00:0:20 GMT'),
		},
		{
			id:v4(),
			title: "Dillagi",
			artist: "Nusrat Fateh Ali Khan",
			album: "Nusrat Vol 1",
			genre: "Qawwali",
			duration: new Date('01 Jan 1970 00:10:00 GMT'),
		},
		{
			id:v4(),
			title: "Shadow Of The Day",
			artist: "Linkin Park",
			album: "Minutes To Midnight",
			genre: "Alt Rock",
			duration: new Date('01 Jan 1970 00:00:05 GMT'),
		},
		{
			id:v4(),
			title: "Koi Faryaad",
			artist: "Jagjit Singh",
			album: "Tum Bin",
			genre: "Ghazal",
			duration: new Date('01 Jan 1970 00:04:20 GMT'),
		},
		{
			id:v4(),
			title: "Chan Kithan",
			artist: "Ayushman Khurana",
			album: "Single",
			genre: "Pop",
			duration: new Date('01 Jan 1970 00:04:46 GMT'),						
		},
		{
			id:v4(),
			title: "Sochta Hoon",
			artist: "Nusrat Fateh Ali Khan",
			album: "Nusrat Vol 2",
			genre: "Qawwali",
			duration: new Date('01 Jan 1970 00:12:45 GMT'),
		},
		{
			id:v4(),
			title: "Perfect",
			artist: "Ed Sheeran",
			album: "Divide",
			genre: "Pop",
			duration: new Date('01 Jan 1970 00:03:00 GMT'),
		},
		{
			id:v4(),
			title: "Demons",
			artist: "Imagine Dragons",
			album: "Night Visions",
			genre: "Alt Rock",
			duration: new Date('01 Jan 1970 00:03:10 GMT'),
		},
		{
			id:v4(),
			title: "Not Afraid",
			artist: "Eminem",
			album: "Recovery",
			genre: "Rap",
			duration: new Date('01 Jan 1970 00:03:40 GMT'),
		},
		{
			id:v4(),
			title: "Never Too Late",
			artist: "Three Days Grace",
			album: "One-X",
			genre: "Rock",
			duration: new Date('01 Jan 1970 00:03:40 GMT'),
		},
		{
			id:v4(),
			title: "Not Afraid",
			artist: "Eminem",
			album: "Recovery",
			genre: "Rap",
			duration: new Date('01 Jan 1970 00:03:40 GMT'),
		},
		{
			id:v4(),
			title: "Not Afraid",
			artist: "Eminem",
			album: "Recovery",
			genre: "Rap",
			duration: new Date('01 Jan 1970 00:03:40 GMT'),
		},
		{
			id:v4(),
			title: "Not Afraid",
			artist: "Eminem",
			album: "Recovery",
			genre: "Rap",
			duration: new Date('01 Jan 1970 00:03:40 GMT'),
		},
		{
			id:v4(),
			title: "Never Too Late",
			artist: "Three Days Grace",
			album: "One-X",
			genre: "Rock",
			duration: new Date('01 Jan 1970 00:03:40 GMT'),
		},
		{
			id:v4(),
			title: "Not Afraid",
			artist: "Eminem",
			album: "Recovery",
			genre: "Rap",
			duration: new Date('01 Jan 1970 00:03:40 GMT'),
		},
		{
			id:v4(),
			title: "Not Afraid",
			artist: "Eminem",
			album: "Recovery",
			genre: "Rap",
			duration: new Date('01 Jan 1970 00:03:40 GMT'),
		},
	],

	nowPlaying: "none"
}

const Delay = (ms) => new Promise((resolve) => setTimeout(resolve,ms));

export const fetchSongs = () =>
	Delay(1000).then(()=> data.songs)