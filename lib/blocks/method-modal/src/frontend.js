/**
 * Method Modal — Frontend
 *
 * The block prints nothing where it sits: the modal registry
 * (lib/class-method-modals.php) prints every modal at the end of the page and
 * enqueues this script. All it does is install the shared behaviour that opens
 * a modal from any link to its id (lib/blocks/utils/modals.js).
 */
import { initMethodModals } from '../../utils/modals';

initMethodModals();
