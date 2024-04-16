import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import View from './view';

const Workspace = () => {
    return (
        <Allotment>
            <Allotment.Pane>
                <View />
            </Allotment.Pane>
            <Allotment.Pane preferredSize={300}>
                <div></div>
            </Allotment.Pane>
        </Allotment>
    )
};

export default Workspace;