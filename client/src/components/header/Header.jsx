
// import { AppBar, Toolbar, styled} from '@mui/material'; 
// import { Link } from 'react-router-dom';



// const Component = styled(AppBar)`
//     background: #FFFFFF;
//     color: black;
// `;

// const Container = styled(Toolbar)`
//     justify-content: center;
//     & > a {
//         padding: 20px;
//         color: #000;
//         text-decoration: none;
//     }
// `

// const Header = () => {

        
//     return (
//         <Component>
//             <Container>
//                 <Link to='/'>HOME</Link>
//                 <Link to='/about'>ABOUT</Link>
//                 <Link to='/contact'>CONTACT</Link>
//                 <Link to='/account'>LOGOUT</Link>
//             </Container>
//         </Component>
//     )
// }

// export default Header;


import { AppBar, Toolbar, styled } from '@mui/material'; 
import { Link, useNavigate } from 'react-router-dom';

const Component = styled(AppBar)`
    background: #FFFFFF;
    color: black;
`;

const Container = styled(Toolbar)`
    justify-content: center;
    & > a {
        padding: 20px;
        color: #000;
        text-decoration: none;
    }
`;

const Header = ({ isAuthenticated, isUserAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    isUserAuthenticated(false);
    navigate('/');
  };

  return (
    <Component>
      <Container>
        <Link to='/'>HOME</Link>
        <Link to='/about'>ABOUT</Link>
        <Link to='/contact'>CONTACT</Link>
        {isAuthenticated ? (
          <span onClick={handleLogout} style={{ cursor: 'pointer' }}>LOGOUT</span>
        ) : (
          <Link to='/account'>LOGIN</Link>
        )}
      </Container>
    </Component>
  );
};

export default Header;
