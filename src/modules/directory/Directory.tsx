import { DirectoryProvider } from './DirectoryContext';
import { ProfileList } from './components/ProfileList';
import { ProfileDetail } from './components/ProfileDetail';

const DirectoryLayout = () => {
    return (
        <div className="flex h-full w-full overflow-hidden bg-black text-green-500 font-code">
            <ProfileList />
            <ProfileDetail />
        </div>
    );
};

const Directory = () => {
    return (
        <DirectoryProvider>
            <DirectoryLayout />
        </DirectoryProvider>
    );
};

export default Directory;
