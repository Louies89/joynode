
const isEmailId = (email) => {
	// Check wheather it is a mail ID format or not. 
	// Does not check for validity of the mail id
	let regEx = /\S+@\S+\.\S+/;  
	return regEx.test(email);
};

// const validatePassword = (password) => {
// 	if (password.length <= 5 || password === '') {
// 		return false;
// 	}
// 	return true;
// };

// const isEmpty = (input) => {
// 	if (input === undefined || input === '') {
// 		return true;
// 	}
// 	if (input.replace(/\s/g, '').length) {
// 		return false;
// 	} 
// 	return true;
// };


// const empty = (input) => {
// 	if (input === undefined || input === '') {
// 		return true;
// 	}
// };

export {
	isEmailId,
	// validatePassword,
	// isEmpty,
	// empty
};