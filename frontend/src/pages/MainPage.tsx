import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import api from '@/shared/api/api';

interface INewLink {
	originalUrl: string;
	shortUrl: string;
	expiresAt: Date;
}
function MainPage() {
	const [originLink, setOriginLink] = React.useState('');
	const [alias, setAlias] = React.useState('');
	const [minutes, setMinutes] = React.useState('');
	const [newLink, setNewLink] = React.useState('');

	const handleSubmit = async () => {
		console.log(import.meta.env.VITE_URL, 'url');
		const link: INewLink = await api.postLink(
			originLink,
			alias,
			Number(minutes),
		);

		setNewLink(`${import.meta.env.VITE_URL}/${link.shortUrl}`);
	};

	return (
		<div className="flex justify-center items-center h-screen flex-col">
			<a className="mb-10 text-blue-500 underline" href={newLink}>
				{newLink}
			</a>
			<Box
				component="form"
				sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
				noValidate
				autoComplete="off"
			>
				<TextField
					id="outlined-controlled"
					label="Оригинальная ссылка"
					value={originLink}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setOriginLink(event.target.value);
					}}
				/>
				<TextField
					id="outlined-controlled"
					label="Пользовательский элиас"
					value={alias}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setAlias(event.target.value);
					}}
				/>
				<TextField
					label="Время жизни ссылки (min)"
					id="outlined-start-adornment"
					sx={{ m: 1, width: '25ch' }}
					value={minutes}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setMinutes(event.target.value);
					}}
				/>
			</Box>

			<Button variant="contained" onClick={handleSubmit}>
				Сгенерировать ссылку
			</Button>
		</div>
	);
}

export default MainPage;
