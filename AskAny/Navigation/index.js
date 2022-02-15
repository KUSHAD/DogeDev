import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

export const Stack = createNativeStackNavigator();

export const Tab = createMaterialBottomTabNavigator();

export const TopTab = createMaterialTopTabNavigator();
