import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
import Content from './alert-dialog-content.svelte';
import Overlay from './alert-dialog-overlay.svelte';
import Header from './alert-dialog-header.svelte';
import Footer from './alert-dialog-footer.svelte';
import Title from './alert-dialog-title.svelte';
import Description from './alert-dialog-description.svelte';
import Action from './alert-dialog-action.svelte';
import Cancel from './alert-dialog-cancel.svelte';

const Root = AlertDialogPrimitive.Root;
const Trigger = AlertDialogPrimitive.Trigger;
const Portal = AlertDialogPrimitive.Portal;

export {
	Root,
	Root as AlertDialog,
	Trigger,
	Trigger as AlertDialogTrigger,
	Portal,
	Portal as AlertDialogPortal,
	Content,
	Content as AlertDialogContent,
	Overlay,
	Overlay as AlertDialogOverlay,
	Header,
	Header as AlertDialogHeader,
	Footer,
	Footer as AlertDialogFooter,
	Title,
	Title as AlertDialogTitle,
	Description,
	Description as AlertDialogDescription,
	Action,
	Action as AlertDialogAction,
	Cancel,
	Cancel as AlertDialogCancel
};
