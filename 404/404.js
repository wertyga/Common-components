import './NotFoundPage.sass'

const noFound = () => {
    return (
        <div className="NotFoundPage"
             style={{
                 width: '100%',
                 display: 'flex',
                 alignItems: 'center',
                 flexDirection: 'column',
                 paddingTop: '10vh',
                 zIndex: 100,
                 height: '100vh',
                 position: 'absolute',
                 top: 0,
                 left: 0
             }}>
            <h2>Page not found</h2>
            <h1>404 Error</h1>
        </div>
    );
};

export default noFound;